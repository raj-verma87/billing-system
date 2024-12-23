import React from 'react';

const ProductList = ({ products }) => {
  return (
    <div> 
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <div key={product.id} style={{ margin: '10px', padding: '1px' }}>
            <li key={product.id}>
              {product.name} - ₹{product.price}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
