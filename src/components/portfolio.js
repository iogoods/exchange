const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware zur Authentifizierung
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Portfolio anzeigen
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.portfolio);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Kryptowährung hinzufügen/entfernen
router.post('/update', authMiddleware, async (req, res) => {
  const { symbol, amount } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const crypto = user.portfolio.find((item) => item.symbol === symbol);
    if (crypto) {
      crypto.amount += amount;
    } else {
      user.portfolio.push({ symbol, amount });
    }

    await user.save();
    res.json(user.portfolio);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
