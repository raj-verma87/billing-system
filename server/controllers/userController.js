// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid user ID or password' });
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password.toString(), user.password);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid user ID or password' });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("JWT token generated:", token);

    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { userId, password } = req.body;

  console.log('Register request received:', { userId, password });

  try {
    const existingUser = await User.findOne({ where: { userId } });

    if (existingUser) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const newUser = await User.create({ userId, password:password.toString() });
    console.log('New user created:', newUser);

    const token = jwt.sign({ userId: newUser.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('JWT token generated:', token);

    res.status(201).json({ token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
};