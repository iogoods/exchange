const Order = require("../models/Order");

const matchOrders = async (newOrder) => {
  const oppositeType = newOrder.type === "buy" ? "sell" : "buy";

  const orders = await Order.find({
    pair: newOrder.pair,
    type: oppositeType,
    price: { $lte: newOrder.price },
    status: "open",
  }).sort({ price: 1 }); // Sort for best match

  for (let order of orders) {
    const amountToTrade = Math.min(order.amount, newOrder.amount);

    order.amount -= amountToTrade;
    newOrder.amount -= amountToTrade;

    if (order.amount === 0) order.status = "fulfilled";
    if (newOrder.amount === 0) newOrder.status = "fulfilled";

    await order.save();
    if (newOrder.amount === 0) break;
  }

  await newOrder.save();
};

const createOrder = async (req, res) => {
  const { userId, type, pair, price, amount } = req.body;
  try {
    const newOrder = await Order.create({ user: userId, type, pair, price, amount });
    await matchOrders(newOrder);

    res.status(201).json({ message: "Order created", order: newOrder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createOrder };
