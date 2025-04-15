// Sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('main.js loaded - sidebar initialization');
  
  // DOM elements
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  
  // Bail if elements don't exist
  if (!sidebar || !menuToggle || !sidebarClose || !sidebarOverlay) {
    console.error('Required sidebar elements not found');
    return;
  }
  
  // Function to open sidebar
  function openSidebar() {
    console.log('Opening sidebar from main.js');
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Staggered animation for menu items
    setTimeout(() => {
      sidebarItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      });
    }, 100);
  }
  
  // Function to close sidebar
  function closeSidebar() {
    console.log('Closing sidebar from main.js');
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset animations
    sidebarItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
    });
  }
  
  // Direct event listeners
  menuToggle.onclick = function(e) {
    e.preventDefault();
    console.log('Menu toggle clicked from main.js');
    openSidebar();
    return false;
  };
  
  sidebarClose.onclick = function(e) {
    e.preventDefault();
    closeSidebar();
    return false;
  };
  
  sidebarOverlay.onclick = function() {
    closeSidebar();
  };
  
  // ESC key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });
  
  // Set active menu item based on current page
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  
  sidebarLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
      if (link.closest('.sidebar-item')) {
        link.closest('.sidebar-item').classList.add('current');
      }
    }
  });
}); 