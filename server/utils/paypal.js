// utils/paypal.js
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
console.log("clientid...",process.env.PAYPAL_CLIENT_ID);
const environment = new checkoutNodeJssdk.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

module.exports = client;