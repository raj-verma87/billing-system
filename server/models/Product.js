// models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');  // Import sequelize instance

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Product;
