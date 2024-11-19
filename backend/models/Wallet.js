const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currency: { type: String, required: true },
  balance: { type: Number, default: 0 },
  depositAddress: { type: String, required: true },
});

module.exports = mongoose.model('Wallet', WalletSchema);
