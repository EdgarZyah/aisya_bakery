const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const Product = db.Product;
const Category = db.Category;
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/products';
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Penambahan fileFilter untuk validasi ekstensi gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Tipe file tidak valid. Hanya .jpg, .jpeg, dan .png yang diizinkan!');
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', async (req, res) => {
  try {
    const { featured, search, categoryId } = req.query;
    const where = {};

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    const products = await Product.findAll({
      where,
      include: {
        model: Category,
        as: 'category'
      }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memuat produk' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: {
        model: Category,
        as: 'category'
      }
    });
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memuat produk' });
  }
});

router.post('/', auth, admin, upload.single('imageUrl'), async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, isFeatured } = req.body;
    const imageUrl = req.file ? path.normalize(req.file.path) : null;

    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      imageUrl,
      categoryId: parseInt(categoryId),
      isFeatured: isFeatured === 'true',
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Gagal menambahkan produk' });
  }
});

router.put('/:id', auth, admin, upload.single('imageUrl'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, isFeatured } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    // Tentukan URL gambar yang baru
    let newImageUrl = product.imageUrl;
    
    // Jika ada file baru yang diunggah, hapus gambar lama
    if (req.file) {
      // Hapus file gambar lama jika ada dan pastikan file tersebut ada secara fisik
      if (product.imageUrl && fs.existsSync(product.imageUrl)) {
        fs.unlinkSync(product.imageUrl);
      }
      // Perbaikan: Normalisasi path gambar yang baru
      newImageUrl = path.normalize(req.file.path);
    }

    const updatedData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId: parseInt(categoryId),
      isFeatured: isFeatured === 'true',
      imageUrl: newImageUrl,
    };

    await product.update(updatedData);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memperbarui produk' });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    if (product.imageUrl && fs.existsSync(product.imageUrl)) {
      fs.unlinkSync(product.imageUrl);
    }
    await product.destroy();
    res.status(200).json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus produk' });
  }
});

module.exports = router;