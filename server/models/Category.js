// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');  // Import sequelize instance

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Category;
