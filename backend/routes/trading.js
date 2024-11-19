const express = require("express");
const { createOrder } = require("../controllers/tradingController");
const router = express.Router();

router.post("/order", createOrder);

module.exports = router;
