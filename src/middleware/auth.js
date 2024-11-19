const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'HARDCODED_JWT_SECRET');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
