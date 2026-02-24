document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.toggle('hidden');
    });
  }
});
