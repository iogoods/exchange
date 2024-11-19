const Wallet = require("../models/Wallet");

const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.params.userId });
    if (!wallet) throw new Error("Wallet not found");
    res.status(200).json(wallet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deposit = async (req, res) => {
  const { userId, currency, amount } = req.body;
  try {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) throw new Error("Wallet not found");

    wallet.balance[currency] += amount;
    await wallet.save();

    res.status(200).json({ message: "Deposit successful", wallet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const withdraw = async (req, res) => {
  const { userId, currency, amount } = req.body;
  try {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) throw new Error("Wallet not found");

    if (wallet.balance[currency] < amount) throw new Error("Insufficient funds");

    wallet.balance[currency] -= amount;
    await wallet.save();

    res.status(200).json({ message: "Withdrawal successful", wallet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getWallet, deposit, withdraw };
