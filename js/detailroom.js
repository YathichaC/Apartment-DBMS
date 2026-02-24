// ข้อมูลห้องทั้งหมด
const roomsData = {
  'A1': { name: 'ห้อง A1', price: 3000, deposit: 5500, signingDay: 3000, status: 'available', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
  'A2': { name: 'ห้อง A2', price: 3000, deposit: 5500, signingDay: 3000, status: 'available', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
  'A3': { name: 'ห้อง A3', price: 3000, deposit: 5500, signingDay: 3000, status: 'full', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800' },
  'A4': { name: 'ห้อง A4', price: 3000, deposit: 5500, signingDay: 3000, status: 'available', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
  'A5': { name: 'ห้อง A5', price: 3200, deposit: 5500, signingDay: 3200, status: 'available', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
  'B1': { name: 'ห้อง B1', price: 3000, deposit: 5500, signingDay: 3000, status: 'available', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
  'B2': { name: 'ห้อง B2', price: 3000, deposit: 5500, signingDay: 3000, status: 'full', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800' },
  'B3': { name: 'ห้อง B3', price: 3000, deposit: 5500, signingDay: 3000, status: 'available', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
  'B4': { name: 'ห้อง B4', price: 3000, deposit: 5500, signingDay: 3000, status: 'available', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
  'B5': { name: 'ห้อง B5', price: 3200, deposit: 5500, signingDay: 3200, status: 'available', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800' }
};

let currentImageIndex = 0;
const images = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
];

function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function goToBooking() {
  const roomId = getQueryParameter('room') || 'A1';
  window.location.href = 'booking.html?room=' + roomId;
}

function loadRoomData() {
  const roomId = getQueryParameter('room') || 'A1';
  const room = roomsData[roomId];

  if (!room) {
    document.body.innerHTML = '<h1>ไม่พบห้องพัก</h1>';
    return;
  }

  document.querySelector('h1').textContent = room.name;
  document.querySelector('.text-3xl.font-bold.mb-4').textContent = `฿${room.price}/เดือน`;
  document.querySelector('.text-xl.font-semibold.mb-2').textContent = `ยอดชำระค่าเงินมัดจำการจองห้องพัก: ฿${room.deposit}`;
  document.querySelector('.text-xl.font-semibold.mb-6').textContent = `ยอดที่ต้องชำระในวันทำสัญญา: ฿${room.signingDay}`;
  
  const statusBadge = document.querySelector('.bg-green-100');
  if (room.status === 'full') {
    statusBadge.className = 'bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold text-sm';
    statusBadge.textContent = 'เต็ม';
    document.querySelector('button:nth-of-type(1)').className = 'w-full bg-gray-400 text-white py-3 rounded-lg font-bold text-lg cursor-not-allowed';
    document.querySelector('button:nth-of-type(1)').disabled = true;
    document.querySelector('button:nth-of-type(1)').textContent = 'เต็มแล้ว';
  } else {
    statusBadge.textContent = 'ว่าง';
  }

  document.getElementById('mainImage').src = room.image;
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateImage();
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateImage();
}

function setImage(index) {
  currentImageIndex = index;
  updateImage();
}

function updateImage() {
  document.getElementById('mainImage').src = images[currentImageIndex];
}

document.addEventListener('DOMContentLoaded', function() {
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('hidden');
    });
  }
  
  loadRoomData();
});
