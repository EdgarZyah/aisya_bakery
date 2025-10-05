const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// ========================= REGISTER =========================
router.post('/register', async (req, res) => {
  const { name, email, password, address, phoneNumber } = req.body;

  try {
    // Cek email unik
    let existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Pengguna dengan email ini sudah ada.' });
    }

    // Buat user (password di-hash otomatis oleh hook)
    const user = await User.create({
      name,
      email,
      password,
      address,
      phoneNumber,
      role: 'user'
    });

    // Buat JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================= LOGIN =========================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Kredensial tidak valid.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Kredensial tidak valid.' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================= GET ALL USERS (ADMIN) =========================
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'address', 'phoneNumber', 'createdAt']
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ========================= GET USER BY ID =========================
router.get('/users/:id', auth, async (req, res) => {
  if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }

  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'address', 'phoneNumber']
    });
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ========================= UPDATE PROFILE =========================
router.put('/users/:id', auth, async (req, res) => {
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }

  const { name, email, address, phoneNumber } = req.body;

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

    await user.update({ name, email, address, phoneNumber });
    res.json({ message: 'Profil berhasil diperbarui.', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ========================= UPDATE ROLE (ADMIN) =========================
router.put('/users/role/:id', auth, admin, async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Peran tidak valid.' });
  }

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

    await user.update({ role });
    res.json({ message: `Role pengguna ${user.name} berhasil diperbarui menjadi ${role}.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ========================= UPDATE PASSWORD =========================
router.put('/users/:id/password', auth, async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;

  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: 'Password baru tidak cocok.' });
  }

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

    user.password = newPassword; // di-hash otomatis oleh hook
    await user.save();

    res.json({ message: 'Password berhasil diperbarui.' });
  } catch (err) {
    console.error('Update Password Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
