const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Coba ambil token dari header
  let token = req.header('x-auth-token');

  // Jika tidak ada di header, coba ambil dari query string
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};