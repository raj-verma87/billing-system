import React, { useState, useEffect } from 'react';
import { fetchProducts, generateBill } from '../../services/api';

const GenerateBill = () => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [gst, setGst] = useState(0);
  const [discount, setDiscount] = useState(0); // Added discount state
  const [makingCharges, setMakingCharges] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [billResponse, setBillResponse] = useState(null);

  // Fetch the products when the component loads
  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    getProducts();
  }, []);

  // Handle product selection and quantity input
  const handleQuantityChange = (productId, quantity) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
      } else {
        return [...prevItems, { productId, quantity }];
      }
    });
  };

  // Submit the bill data to the backend
  const handleGenerateBill = async () => {
    try {
      const { data } = await generateBill({
        items: selectedItems,
        paymentMode,
        gstPercentage:gst,
        discountPercentage: discount, // Send discount percentage
        makingCharges,
        otherCharges,
      });
      setBillResponse(data);
      alert('Bill generated successfully!');
      
      // Reset all input fields after generating the bill
      resetForm();
    } catch (err) {
      console.error('Error generating bill:', err);
      alert('Failed to generate bill');
    }
  };

  // Function to reset all input fields to their initial state
  const resetForm = () => {
    setSelectedItems([]); // Reset selected items (products with quantities)
    setPaymentMode(''); // Reset payment mode
    setGst(0); // Reset GST
    setDiscount(0); // Reset discount
    setMakingCharges(0); // Reset making charges
    setOtherCharges(0); // Reset other charges
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Left Side: Product List */}
      <div style={{ width: '45%' }}>
        <h2>Product List</h2>
        <div>
          {products.map((product) => (
            <div key={product.id} style={{ margin: '10px', padding: '5px' }}>
              <span>
                {product.name} (₹{product.price})
              </span>
              <input
                type="number"
                placeholder="Quantity"
                style={{ marginLeft: '10px' }}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                value={selectedItems.find((item) => item.productId === product.id)?.quantity || 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Payment Details */}
      <div style={{ width: '45%', marginRight: '50px' }}>
        <h2>Payment Details</h2>
        <div style={{ marginBottom: '15px' }}>
          <label>Payment Mode:</label>
          <input
            type="text"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            placeholder="Enter payment mode"
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>GST (%):</label>
          <input
            type="number"
            value={gst}
            onChange={(e) => setGst(parseFloat(e.target.value) || 0)}
            placeholder="Enter GST"
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Discount (%):</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} // Discount input field
            placeholder="Enter discount percentage"
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Making Charges:</label>
          <input
            type="number"
            value={makingCharges}
            onChange={(e) => setMakingCharges(parseFloat(e.target.value) || 0)}
            placeholder="Enter making charges"
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Other Charges:</label>
          <input
            type="number"
            value={otherCharges}
            onChange={(e) => setOtherCharges(parseFloat(e.target.value) || 0)}
            placeholder="Enter other charges"
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <button
          onClick={handleGenerateBill}
          style={{
            marginTop: '20px',
            width: '100%',
            height: '35px',
            fontSize: '18px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Generate Bill
        </button>
      </div>

      {billResponse && (
        <div style={{ marginTop: '20px', width: '100%' }}>
          <h2>Bill Summary</h2>
          <p><strong>Bill ID:</strong> {billResponse.id}</p>
          <ul>
            {billResponse.billItems?.map((item) => (
              <li key={item.id}>
                {item.productName} - ₹{item.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <p><strong>Total Amount:</strong> ₹{billResponse.totalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default GenerateBill;