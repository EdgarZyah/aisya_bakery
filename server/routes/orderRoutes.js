const express = require('express');
const router = express.Router();
const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;
const User = db.User;
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

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

router.post('/checkout', auth, async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Keranjang belanja kosong." });
  }

  try {
    let total = 0;
    const itemDetails = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findByPk(item.id);
        if (!product) {
          throw new Error(`Produk dengan ID ${item.id} tidak ditemukan.`);
        }
        total += product.price * item.quantity;
        return {
          productId: product.id,
          quantity: item.quantity,
        };
      })
    );

    const newOrder = await Order.create({
      userId,
      total,
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

    res.status(201).json({
      message: "Pesanan berhasil dibuat!",
      orderId: newOrder.id,
      total: newOrder.total,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res
      .status(500)
      .json({ message: error.message || "Gagal memproses pesanan." });
  }
});

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
      order.paymentProofUrl = req.file.path;
      await order.save();
      return res.json({ message: 'Bukti pembayaran berhasil diunggah.', order });
    }
    res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
  } catch (error) {
    console.error("Upload payment proof error:", error);
    res.status(500).json({ message: 'Gagal mengunggah bukti pembayaran.' });
  }
});

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

    worksheet.columns = [
      { header: 'ID Pesanan', key: 'id', width: 15 },
      { header: 'Nama Pembeli', key: 'buyerName', width: 25 },
      { header: 'Email Pembeli', key: 'buyerEmail', width: 30 },
      { header: 'Alamat Pengiriman', key: 'shippingAddress', width: 40 },
      { header: 'Item', key: 'items', width: 50 },
      { header: 'Total', key: 'total', width: 20, style: { numFmt: '"Rp"#,##0' } },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Tanggal', key: 'date', width: 20 }
    ];

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

    let totalRevenue = 0;
    orders.forEach(order => {
      totalRevenue += order.total;
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

    worksheet.addRow([]);
    const totalRow = worksheet.addRow({
      buyerName: 'Total Pendapatan:',
      total: totalRevenue
    });
    
    totalRow.getCell('B').font = { bold: true };
    totalRow.getCell('F').font = { bold: true };
    totalRow.getCell('F').numFmt = '"Rp"#,##0';
    totalRow.getCell('B').alignment = { horizontal: 'right' };
    
    worksheet.autoFilter = {
      from: 'A1',
      to: 'H1',
    };

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