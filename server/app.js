require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const Product = require('./models/Product');
const Category = require('./models/Category');
const productRoutes = require('./routes/product');
const categoryRoute = require('./routes/category');
const billRoutes = require('./routes/bill');
const cors = require('cors'); // Import cors middleware
const userRoutes = require('./routes/user'); 
const authRoutes = require('./routes/authRoutes');
const passport = require('passport');
const session = require('express-session');
require('./config/passportConfig'); // Import passport configuration

const app = express();

// Use cors middleware
app.use(cors());

app.use(bodyParser.json());

// Set up session handling
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  
  // Initialize Passport and session handling
  app.use(passport.initialize());
  app.use(passport.session());

app.use('/api/products', productRoutes);
app.use('/api/Categories', categoryRoute);
app.use('/api/bills', billRoutes);
app.use('/api/users', userRoutes); // Use user routes
app.use('/auth', authRoutes);

// Set up relationships
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

//Sync models with the database
// sequelize.sync({ force: true })
//   .then(() => console.log("Tables created successfully"))
//   .catch(err => console.error("Error creating tables: ", err));


module.exports = app;
