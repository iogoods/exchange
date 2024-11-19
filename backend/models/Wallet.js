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
  address: {
    type: String,
    required: true,
    unique: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Wallet', WalletSchema);
