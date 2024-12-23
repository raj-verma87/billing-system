import axios from 'axios';
// require('dotenv').config();

const port = process.env.PORT || 3000;

// Set the base URL for the backend API
const API = axios.create({
  baseURL: `http://localhost:${port}/api`, // Update the port if necessary
});

// Fetch products
export const fetchProducts = () => API.get('/products');

// Add a new product
export const addProduct = (productData) => API.post('/products', productData);

// Generate a bill
export const generateBill = (billData) => API.post('/bills', billData);

// Fetch bill history
export const fetchBills = () => API.get('/bills');

// Fetch bill by ID
export const fetchBillById = (id) => API.get(`/bills/${id}`);

// user login
export const fetchLogin = (loginData) => API.post('/users/login', loginData);

// register user
export const fetchRegister = (registerData) => API.post('/users/register', registerData);

export const fetchFacebookAuth = () => {
  window.location.href = `http://localhost:${port}/auth/facebook`;
};

export const fetchGoogleAuth = () => {
  window.location.href = `http://localhost:${port}/auth/google`;
};

export const fetchGithubAuth = () => {
  window.location.href = `http://localhost:${port}/auth/github`;
};

export default API;
