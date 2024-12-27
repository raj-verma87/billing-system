// controllers/paypalController.js
const logger = require('../logger');
const paypalClient = require('../utils/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// Create an order
const createOrder = async (req, res) => {
    const { amount } = req.body;
    const apiUrl = process.env.BACKEND_URL;

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount,
        },
      }],
      application_context: {
        return_url: `${apiUrl}/api/paypal/return`, // Backend URL for successful payment
        cancel_url: `${apiUrl}/api/paypal/cancel`, // Backend URL for canceled payment
      },
    });
  
    try {
      const order = await paypalClient.execute(request);
      const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;
      logger.log({ level: 'info', message: `Order created: ${order.result.id}` });
      res.status(201).json({ id: order.result.id, approvalUrl });
    } catch (error) {
      console.error('Error creating order:', error);
      logger.log({ level: 'error', message: `Error creating order: ${error.message}` });
      res.status(500).json({ error: error.message });
    }
  };

const captureOrder = async (req, res) => {
    const { id } = req.params;
    console.log("id...", id);
  
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(id);
    request.requestBody({});
    console.log("capture order request...", request);
  
    try {
      const capture = await paypalClient.execute(request);
      console.log("capture order result...", capture.result);
      res.status(200).json(capture.result);
    } catch (error) {
      console.error('Error capturing order:', error);
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { createOrder, captureOrder };