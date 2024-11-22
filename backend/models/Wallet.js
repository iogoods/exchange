const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Verweis auf den Benutzer
  coin: { type: String, enum: ['BTC', 'ETH', 'SOL'], required: true }, // Unterstützte Coins
  balance: { type: Number, default: 0 }, // Aktueller Kontostand
  depositAddress: { type: String, required: true }, // Einzahlungsadresse
  createdAt: { type: Date, default: Date.now }, // Datum der Erstellung
});

module.exports = mongoose.model('Wallet', walletSchema);
