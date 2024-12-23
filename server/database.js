// database.js
const { Sequelize } = require('sequelize');
const config = require('./config/config').development;

// Create Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false, // Disable logging
});

// const sequelize = new Sequelize('mysql://user:password@localhost:3306/mydatabase', {
//   logging: false, // Disable logging
// });


// Test connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
