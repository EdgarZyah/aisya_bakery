const express = require('express');
const router = express.Router();
const db = require('../models');
const Category = db.Category;
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET semua kategori
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memuat kategori' });
  }
});

// POST kategori baru (Hanya Admin)
router.post('/', auth, admin, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ msg: 'Nama kategori wajib diisi.' });
  }
  try {
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menambahkan kategori baru' });
  }
});

// DELETE kategori (Hanya Admin)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Kategori tidak ditemukan.' });
    }
    await category.destroy();
    res.status(200).json({ msg: 'Kategori berhasil dihapus.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus kategori' });
  }
});

module.exports = router;