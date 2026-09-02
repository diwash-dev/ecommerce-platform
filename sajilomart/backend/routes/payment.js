const express = require("express");

const Transaction = require("../models/payment");
const {
  initiatePayment,
  paymentStatus,
} = require("../controllers/paymentcontrollers");

const router = express.Router();

router.post("/initiate-payment", initiatePayment);

router.post("/payment-status", paymentStatus);

module.exports = router;
