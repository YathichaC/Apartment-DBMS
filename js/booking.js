// Set date range for move-in date (1-3 days from today)
function setDateRange() {
  const today = new Date();
  const minDate = new Date(today);
  const maxDate = new Date(today);
  
  minDate.setDate(minDate.getDate() + 1); // Tomorrow
  maxDate.setDate(maxDate.getDate() + 3); // 3 days from today
  
  const moveInDateInput = document.getElementById('moveInDate');
  const dateHelp = document.getElementById('dateHelp');
  
  // Format dates as YYYY-MM-DD for input
  const minDateStr = minDate.toISOString().split('T')[0];
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  moveInDateInput.min = minDateStr;
  moveInDateInput.max = maxDateStr;
  moveInDateInput.value = minDateStr; // Set default to tomorrow
  
  // Show date range helper text
  dateHelp.textContent = `เลือกระหว่าง ${minDate.toLocaleDateString('th-TH')} ถึง ${maxDate.toLocaleDateString('th-TH')}`;
}

// Toggle payment method display
function togglePaymentMethod() {
  const bankSection = document.getElementById('bankSection');
  const qrSection = document.getElementById('qrSection');
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  
  if (paymentMethod === 'bank') {
    bankSection.classList.remove('hidden');
    qrSection.classList.add('hidden');
  } else {
    bankSection.classList.add('hidden');
    qrSection.classList.remove('hidden');
  }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  setDateRange();
  togglePaymentMethod();
  
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Handle form submission
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const fullName = document.getElementById('fullName').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const moveInDate = document.getElementById('moveInDate').value;
      const paymentSlip = document.getElementById('paymentSlip').files[0];

      // Validate form
      if (!fullName || !phone || !email || !moveInDate) {
        alert('กรุณากรอกข้อมูลทั้งหมด');
        return;
      }

      // Show success modal
      const successModal = document.getElementById('successModal');
      successModal.classList.remove('hidden');

      // Reset form
      bookingForm.reset();

      // Close modal after 3 seconds
      setTimeout(() => {
        window.location.href = 'room.html';
      }, 3000);
    });
  }

  // Get room data from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('room') || 'A1';

  // Room data
  const roomsData = {
    'A1': { name: 'ห้อง A1', bookingPrice: 5500, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
    'A2': { name: 'ห้อง A2', bookingPrice: 5500, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    'A3': { name: 'ห้อง A3', bookingPrice: 5500, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
    'A4': { name: 'ห้อง A4', bookingPrice: 5500, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    'A5': { name: 'ห้อง A5', bookingPrice: 5500, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    'B1': { name: 'ห้อง B1', bookingPrice: 5500, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
    'B2': { name: 'ห้อง B2', bookingPrice: 5500, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
    'B3': { name: 'ห้อง B3', bookingPrice: 5500, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400' },
    'B4': { name: 'ห้อง B4', bookingPrice: 5500, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
    'B5': { name: 'ห้อง B5', bookingPrice: 5500, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' }
  };

  // Load room data into summary
  const room = roomsData[roomId] || roomsData['A1'];
  document.getElementById('summaryRoom').textContent = room.name;
  document.getElementById('summaryPrice').textContent = `฿${room.bookingPrice}`;
  document.getElementById('totalPrice').textContent = `฿${room.bookingPrice}`;
  document.getElementById('summaryImage').src = room.image;
});
