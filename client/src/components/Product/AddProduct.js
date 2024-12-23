import React, { useState } from 'react';
import { addProduct } from '../../services/api';

const AddProduct = ({ setProducts }) => {
  const [formData, setFormData] = useState({ name: '', price: '',categoryId: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addProduct({
        name: formData.name,
        price: parseFloat(formData.price), // Ensure price is a number
        categoryId: parseInt(formData.categoryId), // Ensure categoryId is a number
      });
  
      setProducts((prevProducts) => [...prevProducts, data]); // Update parent state
      setFormData({ name: '', price: '',categoryId: '' }); // Reset form
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginTop:20 }}>
      <input
        type="text"
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        style={{ width: '180px', height: '30px', fontSize: '18px' }}  
      />
      <input
        type="number"
        placeholder="Product Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        style={{ width: '180px', height: '30px', fontSize: '18px' }}  
      />
      <input
        type="number"
        placeholder="Category ID"
        value={formData.categoryId}
        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
        required
        style={{ width: '180px', height: '30px', fontSize: '18px' }}  
      />

      <button type="submit" style={{margin:5, width: '150px', height: '35px', fontSize: '18px' }}>Add Product</button>
    </form>
  );
};

export default AddProduct;
