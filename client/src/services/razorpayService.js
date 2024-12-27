// services/razorpayService.js
import axios from 'axios';
import logToServer from '../components/LogService';

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/api/razorpay`; // Adjust the URL as needed

export const createOrder = async (amount) => {
  try {
    const response = await axios.post(`${API_URL}/create-razorpay-order`, { amount });
    logToServer('info', 'rozorpay create order url:',`${API_URL}/create-razorpay-order`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/verify-payment`, paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};