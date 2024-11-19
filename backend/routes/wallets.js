const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');
const axios = require('axios');

// Blockchain-API verwenden, um Einzahlungen zu überwachen
const monitorDeposits = async (coin, depositAddress) => {
  try {
    if (coin === 'BTC') {
      const response = await axios.get(
        `https://blockchain.info/rawaddr/${depositAddress}`
      );
      return response.data.total_received / 1e8; // Satoshi in BTC umwandeln
    } else if (coin === 'ETH') {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=balance&address=${depositAddress}&tag=latest&apikey=YourEtherscanAPIKey`
      );
      return response.data.result / 1e18; // Wei in ETH umwandeln
    } else if (coin === 'SOL') {
      const response = await axios.post(
        'https://api.mainnet-beta.solana.com',
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [depositAddress],
        }
      );
      return response.data.result.value / 1e9; // Lamports in SOL umwandeln
    }
    return 0;
  } catch (error) {
    console.error(`Error monitoring deposits for ${coin}:`, error.message);
    return 0;
  }
};

// Route: Wallets abrufen
router.get('/', authMiddleware, async (req, res) => {
  try {
    const wallets = await Wallet.find({ userId: req.user.id });
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Wallet erstellen
router.post('/create', authMiddleware, async (req, res) => {
  const { coin, depositAddress } = req.body;

  if (!coin || !['BTC', 'ETH', 'SOL'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin' });
  }

  try {
    const wallet = new Wallet({
      userId: req.user.id,
      coin,
      depositAddress,
    });

    await wallet.save();
    res.status(201).json({ wallet, message: 'Wallet successfully created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Einzahlung überwachen und Guthaben aktualisieren
router.post('/deposit/monitor', async (req, res) => {
  try {
    const wallets = await Wallet.find(); // Alle Wallets abrufen

    for (const wallet of wallets) {
      const newBalance = await monitorDeposits(wallet.coin, wallet.depositAddress);
      if (newBalance > wallet.balance) {
        const depositAmount = newBalance - wallet.balance;

        // Guthaben aktualisieren
        wallet.balance = newBalance;
        await wallet.save();

        // Transaktion protokollieren
        const transaction = new Transaction({
          userId: wallet.userId,
          coin: wallet.coin,
          type: 'deposit',
          amount: depositAmount,
          status: 'completed',
          address: wallet.depositAddress,
        });
        await transaction.save();

        console.log(
          `Deposit detected: ${depositAmount} ${wallet.coin} for user ${wallet.userId}`
        );
      }
    }

    res.status(200).json({ message: 'Deposit monitoring completed' });
  } catch (error) {
    console.error('Error during deposit monitoring:', error.message);
    res.status(500).json({ error: 'Failed to monitor deposits' });
  }
});

// Route: Guthaben abrufen
router.get('/balance/:coin', authMiddleware, async (req, res) => {
  const { coin } = req.params;

  try {
    const wallet = await Wallet.findOne({ userId: req.user.id, coin });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.status(200).json({ balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Route: Auszahlung verarbeiten
router.post('/withdraw', authMiddleware, async (req, res) => {
  const { coin, amount, toAddress } = req.body;

  if (!coin || !['BTC', 'ETH', 'SOL'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin type' });
  }

  try {
    const userWallet = await Wallet.findOne({ userId: req.user.id, coin });
    if (!userWallet || userWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Guthaben des Benutzers reduzieren
    userWallet.balance -= amount;
    await userWallet.save();

    // Transaktionsprotokoll hinzufügen
    const transaction = new Transaction({
      userId: req.user.id,
      coin,
      type: 'withdrawal',
      amount,
      status: 'pending',
      address: toAddress,
    });

    await transaction.save();

    // Hier sendest du die Coins von der Hot Wallet (Platzhalter für Blockchain-Transaktion)
    console.log(`Sending ${amount} ${coin} to ${toAddress} from hot wallet`);

    transaction.status = 'completed';
    await transaction.save();

    res.status(200).json({ message: 'Withdrawal processed successfully' });
  } catch (err) {
    console.error('Error processing withdrawal:', err.message);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

module.exports = router;
