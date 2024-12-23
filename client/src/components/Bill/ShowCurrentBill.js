import React from 'react';
import phonepeQRCode from './qrcode.jpeg'; // Adjust the path to your QR code image
import companyLogo from './company-logo.png'; // Adjust the path to your company logo image
import './ShowCurrentBill.css'; // Import the CSS file

const ShowCurrentBill = ({ bill }) => {
  if (!bill) {
    return <div style={{ margin: '20px' }}>No bills found</div>; // Show a loading message if the bill is undefined
  }

  const {
    billItems,
    totalAmount,
    gst,
    makingCharges,
    otherCharges,
    discount,
    paymentMode,
    date,
  } = bill;

  const calculateGrandTotal = () => {
    // Grand total = Total Amount + GST + Making Charges + Other Charges - Discount
    return Math.round(totalAmount + gst + makingCharges + otherCharges - discount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bill-container">
      {/* Header Section */}
      <header className="bill-header">
        <div className="header-left">
          <img src={companyLogo} alt="Company Logo" className="company-logo" />
        </div>
        <div className="header-center">
          <h3>Bill Receipt</h3>
        </div>
        <div className="header-right">
          <p>Digital India New Delhi +91-1234567890</p>
          <p>Date & Time: {new Date(date).toLocaleString()}</p>
        </div>
      </header>

      {/* Product List */}
      <section className="bill-section">
        <h3>Products</h3>
        <table className="bill-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td>₹{item.price * item.quantity}</td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="total-row">
              <td colSpan="3">Total Amount</td>
              <td>₹{totalAmount}</td>
            </tr>
            <tr className="total-row">
              <td colSpan="3">GST</td>
              <td>₹{gst}</td>
            </tr>
            <tr className="total-row">
              <td colSpan="3">Making Charges</td>
              <td>₹{makingCharges}</td>
            </tr>
            <tr className="total-row">
              <td colSpan="3">Other Charges</td>
              <td>₹{otherCharges}</td>
            </tr>
            {/* Discount Row */}
            <tr className="total-row">
              <td colSpan="3">Discount</td>
              <td>₹{discount}</td>
            </tr>
            {/* Grand Total Row */}
            <tr className="total-row">
              <td colSpan="3">Grand Total</td>
              <td>₹{calculateGrandTotal()}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Payment Mode */}
      <section className="bill-section">
        <h3>Payment Mode: {paymentMode}</h3>
      </section>

      {/* QR Code */}
      <section className="qr-code-section">
        <h3>Scan to Pay</h3>
        <img src={phonepeQRCode} alt="QR Code" className="qr-code" />
      </section>

      {/* Footer Section */}
      <footer className="bill-footer">
        <p>Thank you for shopping with us!</p>
        <p>Signature: ___________________</p>
        <button className="no-print" onClick={handlePrint}>Print</button>
      </footer>
    </div>
  );
};

export default ShowCurrentBill;