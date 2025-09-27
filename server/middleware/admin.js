module.exports = function (req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Akses ditolak. Anda bukan admin.' });
  }
  next();
};