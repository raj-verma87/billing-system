const express = require('express');
const passport = require('passport');
require('dotenv').config();

const router = express.Router();

const port_frontend = process.env.PORT_FRONTEND ? `http://localhost:${process.env.PORT_FRONTEND}` : 'http://localhost:4000';

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:4000?isAuthenticated=true'); 
  }
);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:4000?isAuthenticated=true'); 
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:4000?isAuthenticated=true'); 
  }
);

// Route for logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Profile route (protected)
router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {

    if (!req.session.userData) {
      req.session.userData = req.user; // Store user data in the session
    }

    // Access user data in req.user
  const user = req.user;

  // Set the profile picture to user's picture or use the placeholder
  const profilePicture = user.picture || 'https://via.placeholder.com/100';

  res.send(`
    <h1>Welcome, ${user.displayName}</h1>
    <p>Name: ${user.firstName} ${user.lastName}</p>
    <p>Email: ${user.email}</p>
    <p><img src="${profilePicture}" alt="Profile Picture" style="width:100px;height:100px;border-radius:50%;"></p>
    <p><a href="/">Go To Home</a></p>
  `);
  } else {
    res.redirect('/');
  
}
});

module.exports = router;
