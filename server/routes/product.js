// routes/product.js
const express = require('express');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const router = express.Router();

// Route to create a product
router.post('/', createProduct);

// Route to get all products
router.get('/', getAllProducts);

// Route to get a single product by ID
router.get('/:id', getProductById);

// Route to update a product by ID
router.put('/:id', updateProduct);

// Route to delete a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
