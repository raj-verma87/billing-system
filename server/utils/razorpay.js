// utils/razorpay.js
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount, currency = 'INR') => {
  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyPayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const secretKey = process.env.RAZORPAY_KEY_SECRET;
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(razorpay_order_id + "|" +razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

  return generatedSignature === razorpay_signature;
};


module.exports = { createOrder, verifyPayment };