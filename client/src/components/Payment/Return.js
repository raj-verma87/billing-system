import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api'; // Assuming you have an API utility to make requests

const Return = () => {
  const location = useLocation();

  const captureOrder = async (orderId) => {
    try {
      const response = await api.captureOrder(orderId);
      console.log('Order captured successfully:', response);
    } catch (error) {
      console.error('There was a problem capturing the order:', error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('id');
    if (orderId) {
      captureOrder(orderId);
    }
  }, [location]);

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Your payment has been successfully processed.</p>
    </div>
  );
};

export default Return;