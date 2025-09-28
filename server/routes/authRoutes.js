const express = require('express');
const router = express.Router();
const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, address, phoneNumber } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'Pengguna dengan email ini sudah ada.' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: passwordHash,
      address,
      phoneNumber,
      role: 'user'
    });

    const payload = {
      user: {
        id: user.id,
        role: user.role
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address, phoneNumber: user.phoneNumber } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
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
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address, phoneNumber: user.phoneNumber } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private
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

// @route   GET /api/auth/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/users/:id', auth, async (req, res) => {
  if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak.' });
  }
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'address', 'phoneNumber']
    });
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/auth/users/:id
// @desc    Update user profile
// @access  Private (only self)
router.put('/users/:id', auth, async (req, res) => {
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'Akses ditolak. Anda hanya bisa memperbarui profil Anda sendiri.' });
  }
  const { name, email, address, phoneNumber } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }
    await user.update({ name, email, address, phoneNumber });
    res.json({ message: 'Profil berhasil diperbarui.', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/auth/users/role/:id
// @desc    Update user role (Admin only)
// @access  Private (Admin)
router.put('/users/role/:id', auth, admin, async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Peran tidak valid.' });
  }
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }
    await user.update({ role });
    res.json({ message: `Role pengguna ${user.name} berhasil diperbarui menjadi ${role}.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/auth/users/:id/password
// @desc    Update user's own password (Private)
// @access  Private
router.put('/users/:id/password', auth, async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'Akses ditolak. Anda hanya bisa memperbarui password Anda sendiri.' });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: 'Password baru tidak cocok.' });
  }
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }
    
    // Hash password baru dan simpan
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password berhasil diperbarui.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;