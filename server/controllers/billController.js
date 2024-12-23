const Bill = require('../models/Bill');
const BillItem = require('../models/BillItem');
const Product = require('../models/Product');
const { generateUPIQRCode } = require('../utils/qrCode');

// Helper function to calculate GST
const calculateGST = (amount, gstPercentage) => (amount * gstPercentage) / 100;

// Helper function to calculate Discount
const calculateDiscount = (amount, discountPercentage) =>{
  return discountPercentage == 0 ? 0 : (amount * discountPercentage) / 100;
  
}

// Create a new bill with GST and Discount
const createBill = async (req, res) => {
  try {
    const {
      items,
      customerDetails,
      paymentMode,
      gstPercentage = 18, // default GST 18%
      discountPercentage = 0, // default discount 0%
      makingCharges = 0,
      otherCharges = 0,
    } = req.body;

    let subtotal = 0;
    console.log("discountPercentage...",discountPercentage);
    // Create the bill record initially with zero totalAmount
    const bill = await Bill.create({
      gst: 0,
      discount: 0,
      makingCharges,
      otherCharges,
      totalAmount: 0,
      balanceReceived:0,
      balanceDue:0,
      customerDetails: JSON.stringify(customerDetails),
      paymentMode,
    });
    console.log("discountPercentage111...",discountPercentage);
    // Create bill items and calculate subtotal (price before discount)
    await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error(`Product with ID ${productId} not found`);

        const price = product.price * quantity;
        subtotal += price;

        // Create BillItem entries
        return BillItem.create({
          billId: bill.id,
          productId,
          quantity,
          price: product.price,
          productName: product.name,
        });
      })
    );

    // Calculate discount
    const discountAmount = Math.round(calculateDiscount(subtotal, discountPercentage));
    const amountAfterDiscount = subtotal - discountAmount;
    console.log("discountAmount data...",subtotal,discountPercentage);
    console.log("discountAmount...",discountAmount);
    // Calculate GST on the discounted amount
    const gstAmount = Math.round(calculateGST(amountAfterDiscount, gstPercentage));

    // Calculate total amount (after discount) and apply GST, making charges, other charges
    const totalAmount = amountAfterDiscount + gstAmount + makingCharges + otherCharges;

    // Update the bill with the calculated values
    await bill.update({
      totalAmount:subtotal,
      gst: gstAmount,
      discount: discountAmount,
      makingCharges,
      otherCharges,
    });

    // Fetch the detailed bill with related items
    const detailedBill = await Bill.findByPk(bill.id, {
      include: {
        model: BillItem,
        include: Product, // Include product details in the response
      },
    });
    console.log("detailedBill...",detailedBill);
    // Format the response with detailed information
    const formattedBill = {
      id: detailedBill.id,
      date: detailedBill.date,
      customerDetails: detailedBill.customerDetails ? JSON.parse(detailedBill.customerDetails) : {},
      totalAmount: detailedBill.totalAmount,
      gst: detailedBill.gst,
      discount: detailedBill.discount,
      makingCharges: detailedBill.makingCharges,
      otherCharges: detailedBill.otherCharges,
      billItems: detailedBill.BillItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.productName,
      })),
      paymentMode: detailedBill.paymentMode,
    };

    // Send the formatted bill as a response
    res.status(201).json(formattedBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      include: {
        model: BillItem,
        include: Product, // Include product details in the response
      },
      order: [['createdAt', 'DESC']], // Sort bills by the most recent first
    });

    // Map over bills to format customerDetails and totals
    const formattedBills = bills.map((bill) => ({
      id: bill.id,
      date: bill.date,
      customerDetails: bill.customerDetails ? JSON.parse(bill.customerDetails) : {},
      totalAmount: bill.totalAmount,
      gst: bill.gst,
      discount: bill.discount,
      makingCharges: bill.makingCharges,
      otherCharges: bill.otherCharges,
      billItems: bill.BillItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.productName,
      })),
      paymentMode: bill.paymentMode ? bill.paymentMode : "Offline",
    }));

    res.status(200).json(formattedBills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a bill by its ID
const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findByPk(id, {
      include: {
        model: BillItem,
        include: Product, // Include product details in the response
      },
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    const formattedBill = {
      id: bill.id,
      date: bill.date,
      customerDetails: bill.customerDetails ? JSON.parse(bill.customerDetails) : {},
      totalAmount: bill.totalAmount,
      gst: bill.gst,
      discount: bill.discount,
      makingCharges: bill.makingCharges,
      otherCharges: bill.otherCharges,
      billItems: bill.BillItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.productName,
      })),
      paymentMode: bill.paymentMode ? bill.paymentMode : "Offline",
    };

    res.status(200).json(formattedBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new bill with UPI payment integration
const createBillWithPayment = async (req, res) => {
  try {
    const {
      items,
      upiId,
      gstPercentage = 18,
      discountPercentage = 0,
      makingCharges = 0,
      otherCharges = 0,
      customerDetails,
    } = req.body;

    let subtotal = 0;

    // Create the bill record initially with zero totalAmount
    const bill = await Bill.create({
      gst: 0,
      discount: 0,
      makingCharges,
      otherCharges,
      totalAmount: 0,
      customerDetails: JSON.stringify(customerDetails),
      paymentMode: 'UPI',
    });

    const billItems = await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error(`Product with ID ${productId} not found`);

        const price = product.price * quantity;
        subtotal += price;

        return BillItem.create({
          billId: bill.id,
          productId,
          quantity,
          price,
        });
      })
    );

    // Calculate discount and apply it
    const discountAmount = calculateDiscount(subtotal, discountPercentage);
    const amountAfterDiscount = subtotal - discountAmount;

    // Calculate GST on the discounted amount
    const gst = calculateGST(amountAfterDiscount, gstPercentage);

    // Calculate the total amount (after discount) and apply GST, making charges, other charges
    const totalAmount = amountAfterDiscount + gst + makingCharges + otherCharges;

    // Update the bill with the calculated values
    await bill.update({ gst, discount: discountAmount, makingCharges, otherCharges, totalAmount });

    // Generate UPI QR Code
    const qrCode = await generateUPIQRCode(upiId, totalAmount);

    // Fetch the detailed bill with related items
    const detailedBill = await Bill.findByPk(bill.id, {
      include: {
        model: BillItem,
        include: Product, // Include product details in the response
      },
    });

    const formattedBill = {
      id: detailedBill.id,
      date: detailedBill.date,
      customerDetails: detailedBill.customerDetails ? JSON.parse(detailedBill.customerDetails) : {},
      totalAmount: detailedBill.totalAmount,
      gst: detailedBill.gst,
      discount: detailedBill.discount,
      makingCharges: detailedBill.makingCharges,
      otherCharges: detailedBill.otherCharges,
      billItems: detailedBill.BillItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.Product.name,
      })),
      paymentMode: detailedBill.paymentMode,
      qrCode,
    };

    res.status(201).json(formattedBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBill, getAllBills, createBillWithPayment, getBillById };