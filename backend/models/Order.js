const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["buy", "sell"], required: true },
  pair: { type: String, required: true }, // z.B. BTC/USDT
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["open", "fulfilled", "cancelled"], default: "open" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
