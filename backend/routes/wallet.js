const express = require("express");
const { getWallet, deposit, withdraw } = require("../controllers/walletController");
const router = express.Router();

router.get("/:userId", getWallet);
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);

module.exports = router;
