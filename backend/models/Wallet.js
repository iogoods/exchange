const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coin: {
    type: String,
    required: true,
    enum: ['BTC', 'ETH', 'SOL'],
  },
  depositAddress: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Wallet', WalletSchema);
