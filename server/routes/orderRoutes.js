const express = require('express');
const router = express.Router();
const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;
const User = db.User; // Pastikan User di-import
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

// Impor utility mailer (pastikan file ini ada di server/utils/mailer.js)
const { sendPaymentUploadNotification } = require('../utils/mailer');

// --- Konfigurasi Multer (Storage & Filter) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/payments';
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Tipe file tidak valid. Hanya .jpg, .jpeg, .png, dan .pdf yang diizinkan!');
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// --- API Routes ---

/**
 * @route   POST /api/orders/checkout
 * @desc    Membuat pesanan baru (termasuk ongkir)
 * @access  Private (User)
 */
router.post('/checkout', auth, async (req, res) => {
  // [PERBAIKAN] Ambil shippingCost dari body
  const { items, shippingCost } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Keranjang belanja kosong." });
  }

  // Validasi sederhana untuk ongkir
  const finalShippingCost = Number(shippingCost) || 0;

  try {
    // Total kini dihitung dari item saja
    let itemsTotal = 0; 
    const itemDetails = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findByPk(item.id);
        if (!product) {
          throw new Error(`Produk dengan ID ${item.id} tidak ditemukan.`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Stok ${product.name} tidak mencukupi.`);
        }
        itemsTotal += product.price * item.quantity;
        return {
          productId: product.id,
          quantity: item.quantity,
        };
      })
    );

    // [PERBAIKAN] Total akhir = Total Item + Ongkir
    const finalTotal = itemsTotal + finalShippingCost;

    const newOrder = await Order.create({
      userId,
      total: finalTotal, // Simpan total akhir (item + ongkir) ke DB
      status: "pending",
    });

    await Promise.all(
      itemDetails.map((item) =>
        OrderItem.create({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
        })
      )
    );

    // Kirim kembali data order yang lengkap dengan total akhir
    res.status(201).json({
      message: "Pesanan berhasil dibuat!",
      orderId: newOrder.id,
      total: newOrder.total, // Total ini (termasuk ongkir) yg akan dipakai di OrderSuccessPage
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res
      .status(500)
      .json({ message: error.message || "Gagal memproses pesanan." });
  }
});

/**
 * @route   GET /api/orders
 * @desc    Mendapatkan semua pesanan (Admin)
 * @access  Private (Admin)
 */
router.get('/', auth, admin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'address', 'phoneNumber']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: {
            model: Product,
            as: 'product',
            attributes: ['name', 'price']
          }
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    res.status(500).json({ message: "Gagal memuat pesanan." });
  }
});

/**
 * @route   PUT /api/orders/upload-payment-proof/:id
 * @desc    Mengunggah bukti pembayaran
 * @access  Private (User)
 */
router.put('/upload-payment-proof/:id', auth, upload.single('paymentProof'), async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }
    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Akses ditolak.' });
    }

    if (req.file) {
      // Hapus file lama jika ada
      if (order.paymentProofUrl && fs.existsSync(order.paymentProofUrl)) {
         try {
           fs.unlinkSync(order.paymentProofUrl);
         } catch(e) {
           console.warn("Gagal menghapus file bukti bayar lama:", e);
         }
      }

      order.paymentProofUrl = req.file.path;
      await order.save();

      // Kirim Notifikasi Email ke Admin
      try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['name', 'email']
        });

        if (user) {
          sendPaymentUploadNotification(order, user);
        }
      } catch (emailError) {
          console.error("Gagal memicu pengiriman email notifikasi:", emailError);
      }

      return res.json({ message: 'Bukti pembayaran berhasil diunggah.', order });
    }
    res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
  } catch (error) {
    console.error("Upload payment proof error:", error);
    res.status(500).json({ message: 'Gagal mengunggah bukti pembayaran.' });
  }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Mengubah status pesanan (Admin)
 * @access  Private (Admin)
 */
router.put('/:id/status', auth, admin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid.' });
  }
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }
    order.status = status;
    await order.save();
    res.json({ message: `Status pesanan berhasil diperbarui menjadi ${status}.`, order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Gagal memperbarui status pesanan." });
  }
});

/**
 * @route   GET /api/orders/user-orders
 * @desc    Mendapatkan pesanan milik user yang sedang login
 * @access  Private (User)
 */
router.get('/user-orders', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: {
            model: Product,
            as: 'product',
            attributes: ['name', 'price']
          }
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Gagal memuat pesanan." });
  }
});

/**
 * @route   GET /api/orders/export/excel
 * @desc    Mengekspor data pesanan ke Excel (Admin)
 * @access  Private (Admin)
 */
router.get('/export/excel', auth, admin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'address'] },
        {
          model: OrderItem,
          as: 'orderItems',
          include: {
            model: Product,
            as: 'product',
            attributes: ['name']
          }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ringkasan Transaksi');

    // Konfigurasi kolom
    worksheet.columns = [
      { header: 'ID Pesanan', key: 'id', width: 15 },
      { header: 'Nama Pembeli', key: 'buyerName', width: 25 },
      { header: 'Email Pembeli', key: 'buyerEmail', width: 30 }, // Kolom C
      { header: 'Alamat Pengiriman', key: 'shippingAddress', width: 40 },
      { header: 'Item', key: 'items', width: 50 },
      { header: 'Total', key: 'total', width: 20, style: { numFmt: '"Rp"#,##0' } }, // Kolom F
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Tanggal', key: 'date', width: 20 }
    ];

    // Styling Header
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB08968' },
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Kalkulasi Total
    let totalRevenueFinal = 0; // Status: delivered
    let totalRevenueTemporary = 0; // Status: pending, processed, shipped

    orders.forEach(order => {
      // Logika kalkulasi
      if (order.status === 'delivered') {
        totalRevenueFinal += order.total;
      } else if (['pending', 'processed', 'shipped'].includes(order.status)) {
        totalRevenueTemporary += order.total;
      }
      
      // Tambahkan baris data
      const itemsList = order.orderItems.map(item => `${item.product.name} (${item.quantity}x)`).join(', ');
      worksheet.addRow({
        id: order.id,
        buyerName: order.user?.name || 'Pengguna Tidak Terdaftar',
        buyerEmail: order.user?.email || 'N/A',
        shippingAddress: order.user?.address || 'N/A',
        items: itemsList,
        total: order.total,
        status: order.status,
        date: order.createdAt.toLocaleDateString()
      });
    });

    // Baris total pendapatan
    worksheet.addRow([]); 

    // Baris 1: Pendapatan Sementara (Label di Kolom C)
    const totalTemporaryRow = worksheet.addRow({
      buyerEmail: 'Pendapatan Sementara (Pending/Proses/Kirim):', 
      total: totalRevenueTemporary
    });
    totalTemporaryRow.getCell('C').font = { bold: true, color: { argb: 'FF7F00' } }; 
    totalTemporaryRow.getCell('F').font = { bold: true, color: { argb: 'FF7F00' } };
    totalTemporaryRow.getCell('F').numFmt = '"Rp"#,##0';
    totalTemporaryRow.getCell('C').alignment = { horizontal: 'right' }; 

    // Baris 2: Total Pendapatan Akhir (Label di Kolom C)
    const totalFinalRow = worksheet.addRow({
      buyerEmail: 'Total Pendapatan Akhir (Diterima):', 
      total: totalRevenueFinal
    });
    totalFinalRow.getCell('C').font = { bold: true }; 
    totalFinalRow.getCell('F').font = { bold: true };
    totalFinalRow.getCell('F').numFmt = '"Rp"#,##0';
    totalFinalRow.getCell('C').alignment = { horizontal: 'right' }; 
    
    worksheet.autoFilter = {
      from: 'A1',
      to: 'H1',
    };
    
    // Kirim file Excel sebagai respons
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ringkasan_transaksi.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export Excel error:', error);
    res.status(500).json({ message: 'Gagal mengekspor data ke Excel.' });
  }
});

module.exports = router;