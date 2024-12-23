const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Product = require('./Product');
const Bill = require('./Bill');

const BillItem = sequelize.define('BillItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  billId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
});

// Define relationships
Product.hasMany(BillItem, { foreignKey: 'productId' });
BillItem.belongsTo(Product, { foreignKey: 'productId' });

Bill.hasMany(BillItem, { foreignKey: 'billId' });
BillItem.belongsTo(Bill, { foreignKey: 'billId' });

module.exports = BillItem;
