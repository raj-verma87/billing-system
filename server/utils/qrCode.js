const QRCode = require('qrcode');

const generateUPIQRCode = async (upiId, amount) => {
  const upiString = `upi://pay?pa=${upiId}&pn=Shop&am=${amount}&cu=INR`;
  return QRCode.toDataURL(upiString);
};

module.exports = { generateUPIQRCode };
