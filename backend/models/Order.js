const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Verknüpft mit dem Benutzer
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  symbol: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: String, required: true }, // 'Market Price' oder spezifischer Preis
  orderType: { type: String, enum: ['limit', 'market'], required: true },
  status: { type: String, enum: ['Open', 'Executed', 'Closed'], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
