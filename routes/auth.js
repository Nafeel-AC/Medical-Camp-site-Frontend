const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login | MedStudent Prep'
  });
});

// Login handler
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register', {
    title: 'Register | MedStudent Prep'
  });
});

// Register handler
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match');
      return res.redirect('/auth/register');
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash('error_msg', 'Email already registered');
      return res.redirect('/auth/register');
    }
    
    const user = await User.create({ name, email, password });
    
    req.login(user, (err) => {
      if (err) throw err;
      req.flash('success_msg', 'You are now registered and logged in');
      res.redirect('/');
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Server error');
    res.redirect('/auth/register');
  }
});

// Forgot password page
router.get('/forgot-password', (req, res) => {
  res.render('auth/forgot-password', {
    title: 'Forgot Password | MedStudent Prep'
  });
});

// Logout handler
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
  });
});

module.exports = router;