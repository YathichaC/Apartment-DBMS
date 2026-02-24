document.addEventListener('DOMContentLoaded', function () {
  // Menu toggle
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.toggle('hidden');
    });
  }

  // Load rooms state from localStorage
  function syncRoomsState() {
    const storedRooms = localStorage.getItem('apartment_rooms');
    if (storedRooms) {
      const roomsData = JSON.parse(storedRooms);
      roomsData.forEach(room => {
        const card = document.querySelector(`[data-room="${room.id}"]`);
        if (card) {
          const isFull = room.status === 'เต็ม';
          card.setAttribute('data-status', isFull ? 'full' : 'available');

          const priceP = card.querySelector('p');
          if (priceP) priceP.textContent = `฿${room.price.toLocaleString()}/เดือน`;

          const statusSpan = card.querySelector('span');
          if (statusSpan) {
            if (isFull) {
              statusSpan.className = 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold';
              statusSpan.textContent = 'เต็ม';
            } else {
              statusSpan.className = 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold';
              statusSpan.textContent = 'ว่าง';
            }
          }

          const btn = card.querySelector('button');
          if (btn) {
            if (isFull) {
              btn.className = 'w-full mt-4 bg-gray-400 text-white py-2 rounded-lg font-semibold cursor-not-allowed';
              btn.textContent = 'เต็มแล้ว';
              btn.disabled = true;
              btn.removeAttribute('onclick');
            } else {
              btn.className = 'w-full mt-4 bg-green-700 text-white hover:bg-green-800 py-2 rounded-lg font-semibold transition';
              btn.textContent = 'ดูรายละเอียด';
              btn.disabled = false;
              btn.setAttribute('onclick', `goToDetail('${room.id}')`);
            }
          }
        }
      });
    }
  }

  syncRoomsState();

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
