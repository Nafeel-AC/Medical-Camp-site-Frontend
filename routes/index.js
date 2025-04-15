const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('home', {
    title: 'Home | MedStudent Prep',
    user: req.user
  });
});

// Interviews page
router.get('/interviews', (req, res) => {
  res.render('interviews', {
    title: 'Interview Tips | MedStudent Prep',
    user: req.user
  });
});

// Learning page
router.get('/learning', (req, res) => {
  res.render('learning', {
    title: 'Learning Resources | MedStudent Prep',
    user: req.user
  });
});

// Pricing page
router.get('/pricing', (req, res) => {
  res.render('pricing', {
    title: 'Pricing | MedStudent Prep',
    user: req.user
  });
});

module.exports = router;