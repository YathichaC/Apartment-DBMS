document.addEventListener('DOMContentLoaded', function() {
  // Menu toggle
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.toggle('hidden');
    });
  }

  // Room page functions
  function filterRooms() {
    const checkbox = document.getElementById('available-only');
    const roomCards = document.querySelectorAll('[data-room]');
    
    roomCards.forEach(card => {
      const status = card.getAttribute('data-status');
      if (checkbox.checked && status !== 'available') {
        card.style.display = 'none';
      } else {
        card.style.display = '';
      }
    });
  }

  const availCheckbox = document.getElementById('available-only');
  if (availCheckbox) {
    availCheckbox.addEventListener('change', filterRooms);
  }
});

function goToDetail(roomId) {
  window.location.href = `detail.html?room=${roomId}`;
}
