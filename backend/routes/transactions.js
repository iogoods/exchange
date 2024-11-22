const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); // Modell importieren
const authMiddleware = require('../middleware/auth'); // Authentifizierungsmiddleware

// Route: Alle Transaktionen für den angemeldeten Benutzer abrufen
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Route: Neue Transaktion hinzufügen
router.post('/', authMiddleware, async (req, res) => {
  const { coin, type, amount, status, address } = req.body;

  if (!coin || !type || !amount || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transaction = new Transaction({
      userId: req.user.id,
      coin,
      type,
      amount,
      status,
      address,
    });

    await transaction.save();
    res.status(201).json({ transaction, message: 'Transaction added successfully' });
  } catch (error) {
    console.error('Error adding transaction:', error.message);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

module.exports = router;
