const express = require('express');
const { createBill, getAllBills, getBillById } = require('../controllers/billController');
const router = express.Router();

// Create a bill
router.post('/', createBill);

// Get all bills
router.get('/', getAllBills);

// Get bill by ID
router.get('/:id', getBillById);

module.exports = router;
