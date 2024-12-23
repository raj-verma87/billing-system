import React, { useState, useEffect } from 'react';
import { fetchBills } from '../../services/api';

const BillHistory = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const getBills = async () => {
      try {
        const { data } = await fetchBills();
        setBills(data);
      } catch (err) {
        console.error('Error fetching bills:', err);
      }
    };

    getBills();
  }, []);

  return (
    <div>
      <h2>Bill History</h2>
      {bills.length === 0 ? (
        <p>No bills available.</p>
      ) : (
        <div>
          {bills.map((bill) => (
            <div key={bill.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <p><strong>Bill ID:</strong> {bill.id}</p>
              <p><strong>Date:</strong> {new Date(bill.date).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> ₹{bill.totalAmount}</p>
              <ul>
                {bill.billItems?.map((item) => (
                  <li key={item.id}>
                    {item.productName} - ₹{item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillHistory;
