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
const upload = multer({ storage: storage });

// Rute untuk proses checkout
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

// Rute GET untuk admin untuk melihat semua pesanan
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

// Rute untuk user mengunggah bukti pembayaran
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

// Rute untuk admin memperbarui status pesanan
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

// Rute untuk user mengambil pesanannya
router.get('/user-orders', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id }, // Perbaikan: Memastikan filter menggunakan userId
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

module.exports = router;