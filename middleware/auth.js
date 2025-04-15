// middleware/auth.js
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to access this page');
    res.redirect('/auth/login');
  }
  
  function ensurePremium(req, res, next) {
    if (req.isAuthenticated() && req.user.isPremium) {
      return next();
    }
    req.flash('error_msg', 'Premium subscription required');
    res.redirect('/pricing');
  }
  
  module.exports = { ensureAuthenticated, ensurePremium };