const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: {
    BTC: { type: Number, default: 0 },
    ETH: { type: Number, default: 0 },
    USDT: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);
