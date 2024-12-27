// routes/payment.js
const express = require('express');
const { createOrder, verifyPayment } = require('../utils/razorpay');
const router = express.Router();

router.post('/create-razorpay-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await createOrder(amount);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-payment', (req, res) => {
    console.log("verify body data...",req.body);
  const {razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const isValid = verifyPayment(razorpay_order_id,razorpay_payment_id, razorpay_signature);

  if (isValid) {
    res.status(200).json({ message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid payment signature' });
  }
});

module.exports = router;