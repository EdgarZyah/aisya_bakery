const express = require('express');
const router = express.Router();
const db = require('../models');
const Testimonial = db.Testimonial;
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/testimonials';
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

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
    const testimonials = await Testimonial.findAll();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat testimonial' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial tidak ditemukan' });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat testimonial' });
  }
});

router.post('/', auth, admin, upload.single('avatar'), async (req, res) => {
  try {
    const { name, comment } = req.body;
    const avatar = req.file ? req.file.path : null;

    const newTestimonial = await Testimonial.create({
      name,
      comment,
      avatar
    });
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(400).json({ error: 'Gagal menambahkan testimonial' });
  }
});

router.put('/:id', auth, admin, upload.single('avatar'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, comment } = req.body;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial tidak ditemukan' });
    }

    if (req.file && testimonial.avatar) {
      if (fs.existsSync(testimonial.avatar)) {
        fs.unlinkSync(testimonial.avatar);
      }
    }
    
    const updatedData = {
      name,
      comment,
      avatar: req.file ? req.file.path : testimonial.avatar,
    };
    
    await testimonial.update(updatedData);
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui testimonial' });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial tidak ditemukan' });
    }
    if (testimonial.avatar && fs.existsSync(testimonial.avatar)) {
      fs.unlinkSync(testimonial.avatar);
    }
    await testimonial.destroy();
    res.status(200).json({ message: 'Testimonial berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus testimonial' });
  }
});

module.exports = router;