const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Bill = sequelize.define('Bill', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  gst: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0, // Default to 0 for GST
  },
  makingCharges: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0, // Default to 0 for making charges
  },
  otherCharges: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0, // Default to 0 for other charges
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0, // Default to 0 for other charges
  },
  balanceReceived: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0, // Default to 0 for other charges
  },
  balanceDue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0, // Default to 0 for other charges
  },
  paymentMode: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "offline", // Default to offline for other charges
  },
});

module.exports = Bill;