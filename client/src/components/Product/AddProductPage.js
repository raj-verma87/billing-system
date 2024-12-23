import React from 'react';
import AddProduct from './AddProduct';
import ProductList from './ProductList';

const AddProductPage = ({ setProducts, products }) => {
  return (
    <div>
      <AddProduct setProducts={setProducts} />
      <ProductList products={products} setProducts={setProducts} />
    </div>
  );
};

export default AddProductPage;