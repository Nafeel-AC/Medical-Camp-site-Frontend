document.addEventListener('DOMContentLoaded', function() {
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
          e.preventDefault();
          alert('Please fill in all fields');
        }
      });
    }
  
    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!name || !email || !password || !confirmPassword) {
          e.preventDefault();
          alert('Please fill in all fields');
          return;
        }
        
        if (password !== confirmPassword) {
          e.preventDefault();
          alert('Passwords do not match');
          return;
        }
        
        if (password.length < 6) {
          e.preventDefault();
          alert('Password must be at least 6 characters');
        }
      });
    }
  
    // Password reset form handling
    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
      resetForm.addEventListener('submit', function(e) {
        const email = document.getElementById('email').value;
        
        if (!email) {
          e.preventDefault();
          alert('Please enter your email');
        }
      });
    }
  });