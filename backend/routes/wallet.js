const express = require('express');
const Wallet = require('../models/Wallet');
const router = express.Router();

// Einzahlungsadresse abrufen
router.get('/deposit/:currency', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id, currency: req.params.currency });
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    res.json({ depositAddress: wallet.depositAddress });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Auszahlung durchführen
router.post('/withdraw', async (req, res) => {
  const { currency, amount, destination } = req.body;

  try {
    const wallet = await Wallet.findOne({ userId: req.user.id, currency });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance or wallet not found' });
    }

    wallet.balance -= amount;
    await wallet.save();

    res.json({ message: 'Withdrawal successful', transactionId: 'fake_tx_id' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
