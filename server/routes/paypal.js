// routes/paypal.js
const express = require('express');
const { createOrder, captureOrder } = require('../controllers/paypalController');
const router = express.Router();
const logger = require('../logger');

router.post('/create-order', createOrder);
router.post('/capture-order/:id', captureOrder);

// Define return and cancel routes
router.get('/return', (req, res) => {
    console.log('token...');
    const apiUrl = process.env.FRONTEND_URL;
    const { token } = req.query;
    console.log('token...', apiUrl);
    logger.log({ level: 'info', message: `Payment successful for order ${token}` });
    console.log(`Redirecting to frontend /return with token: ${token}`);
    res.redirect(`${apiUrl}/show-bill?id=${token}`);
  });
  
  router.get('/cancel', (req, res) => {
    const apiUrl = process.env.FRONTEND_URL;
    res.redirect(`${apiUrl}/show-bill?isCancelled=true`);
  });

module.exports = router;