import React, { useState, useEffect, useRef } from 'react';
import phonepeQRCode from './qrcode.jpeg'; // Adjust the path to your QR code image
import companyLogo from './company-logo.png'; // Adjust the path to your company logo image
import './ShowCurrentBill.css'; // Import the CSS file
import { useNavigate, useLocation } from 'react-router-dom';
import logToServer from '../LogService';
import { createOrder, verifyPayment } from '../../services/razorpayService';
import { createOrderPayPal, captureOrder } from '../../services/api';

const ShowCurrentBill = ({ bill }) => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const hasCapturedOrder = useRef(false);

  const captureOrders = async (orderId) => {
    try {
      const response = await captureOrder(orderId);
      console.log('Order captured successfully:', response);
      setPaymentStatus('Payment Successful');
    } catch (error) {
      setPaymentStatus('Payment Initiation Failed');
      console.error('There was a problem capturing the order:', error);
    }
  };

  useEffect(() => {
    if (!hasCapturedOrder.current) {
      const params = new URLSearchParams(location.search);
      const orderId = params.get('id');
      if (orderId) {
        captureOrders(orderId);
        hasCapturedOrder.current = true;
      } else {
        const isCancelled = params.get('isCancelled');
        if (isCancelled) {
          setPaymentStatus('Payment Cancelled');
        }
      }
    }
  }, [location]);

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

  const handlePayPal = async () => {
    try {
      const orderData = {
        amount: calculateGrandTotal(),
        paymentMode: paymentMode,
        // Add any other necessary data here
      };

      console.log('Creating order with data:', orderData);
      logToServer('info', 'Creating order with data:', orderData);
      const createOrderResponse = await createOrderPayPal(orderData);

      if (createOrderResponse.status !== 201) {
        throw new Error('Failed to create order');
      }
      console.log('createOrderResponse', createOrderResponse.data);
      logToServer('info', 'createOrderResponse', createOrderResponse.data.approvalUrl);
      const { approvalUrl } = createOrderResponse.data;
      window.location.href = approvalUrl;

    } catch (error) {
      console.error('There was a problem with the payment operation:', error);
      logToServer('error', 'There was a problem with the payment operation:', error);
    }
  };

  const handleRazorPay = async () => {
    try {
      logToServer('info', 'Initiating payment with Razorpay');
      const orderData = {
        amount: calculateGrandTotal(),
        paymentMode: paymentMode,
        // Add any other necessary data here
      };
      const order = await createOrder(orderData.amount); // Replace 500 with the actual amount
      console.log('RAZORPAY_KEY_ID', process.env.REACT_APP_RAZORPAY_KEY_ID);
      // Assuming you have Razorpay script loaded in your index.html
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your Razorpay key
        amount: order.amount,
        currency: 'INR',
        name: 'Raj Verma',
        description: 'bill payment',
        order_id: order.id,
        handler: async function (response) {
          // Handle payment success
          console.log("create order response...", response);
          try {
            const verificationResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            console.log('Payment verified successfully', verificationResponse);
            setPaymentStatus('Payment Successful');
            // Handle successful verification (e.g., show a success message, update UI, etc.)
          } catch (verificationError) {
            console.error('Payment verification failed', verificationError);
            setPaymentStatus('Payment Verification Failed');
            // Handle verification failure (e.g., show an error message, retry, etc.)
          }
        },
        modal: {
          ondismiss: async () => {
            // Triggered when the user closes the Razorpay modal
            console.log("Payment cancelled by user.");
            setPaymentStatus('Payment Cancelled');
            //await handlePaymentCancelled(order.id); // Notify backend about cancellation
          },
        },
        prefill: {
          name: 'Raj Verma',
          email: 'razorUser@gmail.com',
          contact: '8586060220'
        },
        notes: {
          address: '264/22 Gandhi Nagar, Gurgaon'
        },
        theme: {
          color: '122001'
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed', error);
      setPaymentStatus('Payment Initiation Failed');
    }
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
      {/* Payment Buttons */}
      <section className="bill-section">
        <h3>Payment Options To Pay Online</h3>
        <button className="payment-button" style={{ marginRight: '10px' }} onClick={() => { handlePayPal(); }}>Pay with PayPal</button>
        <button className="payment-button" onClick={() => { handleRazorPay(); }}>Pay with Razorpay</button>
      </section>
      {/* QR Code */}
      <section className="qr-code-section">
        <h3>Scan to Pay</h3>
        <img src={phonepeQRCode} alt="QR Code" className="qr-code" />
      </section>

      {/* Footer Section */}
      <footer className="bill-footer">
        <button className="no-print" onClick={handlePrint} style={{ marginRight: '10px' }}>Print</button>
        <button className="no-print" onClick={() => navigate('/')}>Home</button>
        {paymentStatus && <p>{paymentStatus}</p>}

        <p>Thank you for shopping with us!</p>
        <p>Signature: ___________________</p>



      </footer>
    </div>
  );
};

export default ShowCurrentBill;