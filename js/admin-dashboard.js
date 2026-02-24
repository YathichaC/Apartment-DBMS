document.addEventListener('DOMContentLoaded', function () {
  let rooms = [];
  const storedRooms = localStorage.getItem('apartment_rooms');
  if (storedRooms) {
    rooms = JSON.parse(storedRooms);
  } else {
    rooms = [
      { id: 'A1', status: 'ว่าง', price: 3000 },
      { id: 'A2', status: 'ว่าง', price: 3000 },
      { id: 'A3', status: 'เต็ม', price: 3000 },
      { id: 'A4', status: 'ว่าง', price: 3000 },
      { id: 'A5', status: 'ว่าง', price: 3200 },
      { id: 'B1', status: 'ว่าง', price: 3000 },
      { id: 'B2', status: 'เต็ม', price: 3000 },
      { id: 'B3', status: 'ว่าง', price: 3000 },
      { id: 'B4', status: 'ว่าง', price: 3000 },
      { id: 'B5', status: 'ว่าง', price: 3200 }
    ];
    localStorage.setItem('apartment_rooms', JSON.stringify(rooms));
  }

  const bookingRequests = [
    { id: 1, room: 'A2', name: 'Somchai', phone: '081-234-5678', status: 'pending', requestDate: '2026-02-20T10:15:00', slip: null },
    { id: 2, room: 'B3', name: 'Suda', phone: '082-345-6789', status: 'pending', requestDate: '2026-02-22T14:30:00', slip: 'https://via.placeholder.com/800x600?text=Slip+2' },
    { id: 3, room: 'A4', name: 'Niran', phone: '083-456-7890', status: 'pending', requestDate: '2026-02-24T09:00:00', slip: 'https://via.placeholder.com/800x600?text=Slip+3' }
  ];

  const roomMeters = {
    'A1': { water: 100, elec: 500 },
    'A2': { water: 120, elec: 600 },
    'A3': { water: 140, elec: 700 },
    'A4': { water: 100, elec: 500 },
    'A5': { water: 100, elec: 500 },
    'B1': { water: 100, elec: 500 },
    'B2': { water: 100, elec: 500 },
    'B3': { water: 100, elec: 500 },
    'B4': { water: 100, elec: 500 },
    'B5': { water: 100, elec: 500 },
  };

  let bills = [
    { id: 1, room: 'A1', month: 'กุมภาพันธ์', year: 2026, roomPrice: 3000, prevWater: 95, currWater: 100, prevElec: 450, currElec: 500, waterCost: 125, elecCost: 350, total: 3475 }
  ];

  const payments = [
    { id: 1, room: 'A2', month: 'มกราคม', year: '2026', amount: 3000, payDate: '2026-01-05T10:15:00', slip: 'https://via.placeholder.com/800x600/10b981/ffffff?text=Slip+Jan+A2' },
    { id: 2, room: 'B5', month: 'กุมภาพันธ์', year: '2026', amount: 3200, payDate: '2026-02-02T13:45:00', slip: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Slip+Feb+B5' }
  ];

  let users = [
    { id: 1, room: 'A3', username: 'user_a3', password: 'password123' },
    { id: 2, room: 'B2', username: 'user_b2', password: 'password456' }
  ];

  let contracts = [
    { id: 1, room: 'A3', uploadDate: '2026-02-01', fileName: 'contract-a3.pdf', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
  ];

  // Page switching
  const pageBtns = document.querySelectorAll('.page-btn');
  const views = document.querySelectorAll('.page-view');
  function showPage(name) {
    views.forEach(v => v.classList.add('hidden'));
    const el = document.getElementById(name);
    if (el) el.classList.remove('hidden');
    pageBtns.forEach(b => {
      b.classList.remove('bg-green-50');
      if (b.dataset.page === name) {
        b.classList.add('bg-green-50');
      }
    });

    closeMobileSidebar();
  }
  pageBtns.forEach(b => b.addEventListener('click', () => showPage(b.dataset.page)));

  // Mobile sidebar logic
  const mobileSidebar = document.getElementById('mobileSidebar');
  const mobileSidebarPanel = document.getElementById('mobileSidebarPanel');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');

  function openMobileSidebar() {
    if (!mobileSidebar) return;
    mobileSidebar.classList.remove('hidden');
    // slight delay for transition
    setTimeout(() => {
      mobileSidebar.classList.remove('opacity-0');
      mobileSidebarPanel.classList.remove('-translate-x-full');
    }, 10);
  }

  function closeMobileSidebar() {
    if (!mobileSidebar) return;
    mobileSidebar.classList.add('opacity-0');
    mobileSidebarPanel.classList.add('-translate-x-full');
    // wait for transition end
    setTimeout(() => {
      mobileSidebar.classList.add('hidden');
    }, 300);
  }

  mobileMenuBtn?.addEventListener('click', openMobileSidebar);
  closeMobileMenuBtn?.addEventListener('click', closeMobileSidebar);
  mobileSidebar?.addEventListener('click', (e) => {
    if (e.target === mobileSidebar) {
      closeMobileSidebar();
    }
  });

  // Render dashboard counts
  function renderCounts() {
    const total = rooms.length;
    const available = rooms.filter(r => r.status === 'ว่าง').length;
    const occupied = rooms.filter(r => r.status === 'เต็ม').length;
    document.getElementById('totalRooms').textContent = total;
    document.getElementById('availableRooms').textContent = available;
    document.getElementById('occupiedRooms').textContent = occupied;
  }

  // Render rooms table
  function renderRooms() {
    const tbody = document.getElementById('roomsTable');
    tbody.innerHTML = '';
    rooms.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-4 py-2">${r.id}</td>
        <td class="px-4 py-2">${r.status === 'ว่าง' ? '<span class="text-green-600">ว่าง</span>' : '<span class="text-red-600">เต็ม</span>'}</td>
        <td class="px-4 py-2">฿${r.price}</td>
        <td class="px-4 py-2">
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" data-room="${r.id}" class="toggle-switch sr-only" ${r.status === 'เต็ม' ? 'checked' : ''} />
            <span class="w-11 h-6 rounded-full relative transition-colors ${r.status === 'เต็ม' ? 'bg-red-500' : 'bg-green-500'}" aria-hidden="true">
              <span class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${r.status === 'เต็ม' ? 'translate-x-5' : ''}"></span>
            </span>
          </label>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // attach change handler to the toggle switches
    document.querySelectorAll('.toggle-switch').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.dataset.room;
        const room = rooms.find(x => x.id === id);
        if (!room) return;
        room.status = input.checked ? 'เต็ม' : 'ว่าง';
        localStorage.setItem('apartment_rooms', JSON.stringify(rooms));
        renderRooms(); renderCounts(); renderChart(); renderRecentRequests();
      });
    });
  }

  // Chart.js pie chart showing available vs occupied
  let roomChart = null;
  function renderChart() {
    const available = rooms.filter(r => r.status === 'ว่าง').length;
    const occupied = rooms.filter(r => r.status === 'เต็ม').length;
    const ctx = document.getElementById('roomChart');
    if (!ctx) return;
    const data = {
      labels: ['ว่าง', 'เต็ม'],
      datasets: [{
        data: [available, occupied],
        backgroundColor: ['#16a34a', '#ef4444']
      }]
    };
    if (roomChart) {
      roomChart.data = data;
      roomChart.update();
      return;
    }
    roomChart = new Chart(ctx.getContext('2d'), {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true }
        }
      }
    });
  }

  // Render recent booking requests (3 latest)
  function renderRecentRequests() {
    const container = document.getElementById('recentRequests');
    if (!container) return;
    // sort by requestDate (newest first) or id if no date
    const sorted = bookingRequests.slice().sort((a, b) => {
      if (a.requestDate && b.requestDate) return new Date(b.requestDate) - new Date(a.requestDate);
      return b.id - a.id;
    }).slice(0, 3);
    container.innerHTML = '';
    sorted.forEach(r => {
      const div = document.createElement('div');
      div.className = 'p-3 rounded border bg-gray-50';
      const date = r.requestDate ? (new Date(r.requestDate)).toLocaleDateString('th-TH') : '';
      div.innerHTML = `<div class="font-medium">${r.name}</div><div class="text-sm text-muted-foreground">${date} — ห้อง ${r.room}</div>`;
      container.appendChild(div);
    });
  }

  // Render booking requests
  function renderRequests() {
    const container = document.getElementById('requestsList');
    if (!container) return;
    const filterVal = document.getElementById('filterRequests')?.value; // YYYY-MM
    container.innerHTML = '';

    let filtered = bookingRequests;
    if (filterVal) {
      filtered = filtered.filter(r => r.requestDate && r.requestDate.startsWith(filterVal));
    }

    filtered.forEach(r => {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 rounded shadow';
      const dateStr = r.requestDate ? new Date(r.requestDate).toLocaleString('th-TH') : '';
      div.innerHTML = `
        <div class="flex items-start justify-between">
          <div>
            <div class="font-medium">${r.name}</div>
            <div class="text-sm text-gray-500">${r.phone || ''}</div>
            <div class="text-sm text-gray-500">${dateStr}</div>
            <div class="text-sm">ห้อง: <strong>${r.room}</strong></div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <div class="flex items-center gap-2">
              ${r.slip ? `<button data-slip="${r.slip}" class="view-slip px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded text-sm font-medium transition-colors">ดูสลิป</button>` : ''}
            </div>
              </div>
          </div>
        </div>
      `;
      container.appendChild(div);
    });

    // view slip
    container.querySelectorAll('.view-slip').forEach(b => b.addEventListener('click', () => {
      const src = b.dataset.slip;
      showSlipModal(src);
    }));

    // no approve/reject buttons anymore; only view-slip remains
  }

  // Slip modal helpers
  function showSlipModal(src) {
    const modal = document.getElementById('slipModal');
    const img = document.getElementById('slipImg');
    if (!modal || !img) return;
    img.src = src;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  function closeSlipModal() {
    const modal = document.getElementById('slipModal');
    const img = document.getElementById('slipImg');
    if (!modal || !img) return;
    img.src = '';
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
  // close handlers
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('slipModal');
    if (!modal) return;
    if (e.target === modal) closeSlipModal();
  });
  const closeBtn = document.getElementById('closeSlip');
  if (closeBtn) closeBtn.addEventListener('click', closeSlipModal);

  // Render bills
  function renderBills() {
    const container = document.getElementById('billsList');
    if (!container) return;
    container.innerHTML = '';
    bills.forEach(b => {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 rounded shadow flex items-center justify-between';
      div.innerHTML = `
        <div>
          <div class="font-medium text-lg text-gray-800">ห้อง ${b.room}</div>
          <div class="text-sm text-gray-500">${b.month} ${b.year}</div>
          <div class="text-sm mt-1">ราคา: <span class="text-green-600 font-medium">฿${b.total}</span></div>
        </div>
        <div class="flex items-center gap-2">
          <button data-id="${b.id}" class="view-bill px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors">รายละเอียด</button>
          <button data-id="${b.id}" class="edit-bill px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded text-sm font-medium transition-colors">แก้ไข</button>
          <button data-id="${b.id}" class="delete-bill px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium transition-colors">ลบ</button>
        </div>
      `;
      container.appendChild(div);
    });

    container.querySelectorAll('.view-bill').forEach(btn => btn.addEventListener('click', () => showBillDetails(parseInt(btn.dataset.id))));
    container.querySelectorAll('.edit-bill').forEach(btn => btn.addEventListener('click', () => openEditBill(parseInt(btn.dataset.id))));
    container.querySelectorAll('.delete-bill').forEach(btn => btn.addEventListener('click', () => deleteBill(parseInt(btn.dataset.id))));
  }

  // Render payments
  function renderPayments() {
    const container = document.getElementById('paymentsList');
    if (!container) return;
    const filterVal = document.getElementById('filterPayments')?.value; // YYYY-MM
    container.innerHTML = '';

    let filtered = payments;
    if (filterVal) {
      filtered = filtered.filter(p => p.payDate && p.payDate.startsWith(filterVal));
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div class="text-gray-500 text-center py-4">ไม่พบข้อมูลในเดือนที่เลือก</div>';
    }

    filtered.forEach(p => {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center justify-between gap-4';
      const dateStr = p.payDate ? new Date(p.payDate).toLocaleString('th-TH') : '';
      div.innerHTML = `
        <div class="space-y-1">
          <div class="font-medium text-lg">ห้อง ${p.room}</div>
          <div class="text-sm text-gray-600">รอบบิล: ${p.month} ${p.year}</div>
          <div class="text-sm text-gray-600">ราคา: <span class="text-green-600 font-medium">฿${p.amount}</span></div>
          <div class="text-sm text-gray-500">วันที่จ่าย: ${dateStr}</div>
        </div>
        <div>
          ${p.slip ? `<button data-slip="${p.slip}" class="view-payment-slip px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded text-sm font-medium transition-colors">ดูสลิป</button>` : ''}
        </div>
      `;
      container.appendChild(div);
    });

    container.querySelectorAll('.view-payment-slip').forEach(btn => {
      btn.addEventListener('click', () => {
        showSlipModal(btn.dataset.slip);
      });
    });
  }

  // --- Bill Modal & Logic ---
  const billModal = document.getElementById('billModal');
  const billForm = document.getElementById('billForm');
  const billRoomSel = document.getElementById('billRoom');
  const calcRoomPrice = document.getElementById('calcRoomPrice');
  const calcWaterCost = document.getElementById('calcWaterCost');
  const calcElecCost = document.getElementById('calcElecCost');
  const calcTotalCost = document.getElementById('calcTotalCost');

  function populateRoomOptions() {
    if (!billRoomSel) return;
    billRoomSel.innerHTML = '<option value="">-- เลือกห้อง --</option>';
    rooms.forEach(r => {
      billRoomSel.innerHTML += `<option value="${r.id}" data-price="${r.price}">${r.id} (฿${r.price})</option>`;
    });
  }

  document.getElementById('showAddBillModal')?.addEventListener('click', () => {
    populateRoomOptions();
    billForm.reset();
    document.getElementById('billId').value = '';
    document.getElementById('billModalTitle').textContent = 'เพิ่มบิลใหม่';
    document.getElementById('billYear').value = new Date().getFullYear();
    calcRoomPrice.textContent = '฿0';
    calcWaterCost.textContent = '฿0';
    calcElecCost.textContent = '฿0';
    calcTotalCost.textContent = '฿0';
    billModal.classList.remove('hidden');
    billModal.classList.add('flex');
  });

  document.getElementById('cancelBillBtn')?.addEventListener('click', closeBillModal);

  function closeBillModal() {
    if (billModal) {
      billModal.classList.remove('flex');
      billModal.classList.add('hidden');
    }
  }

  billRoomSel?.addEventListener('change', () => {
    const roomId = billRoomSel.value;
    if (!roomId) return;
    const prev = roomMeters[roomId] || { water: 0, elec: 0 };
    document.getElementById('prevWater').value = prev.water;
    document.getElementById('prevElec').value = prev.elec;
    calculatePreview();
  });

  document.getElementById('currWater')?.addEventListener('input', calculatePreview);
  document.getElementById('currElec')?.addEventListener('input', calculatePreview);

  function calculatePreview() {
    const roomId = billRoomSel.value;
    if (!roomId) return;
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const prevW = parseFloat(document.getElementById('prevWater').value) || 0;
    const currW = parseFloat(document.getElementById('currWater').value) || 0;
    const prevE = parseFloat(document.getElementById('prevElec').value) || 0;
    const currE = parseFloat(document.getElementById('currElec').value) || 0;

    const usedW = Math.max(0, currW - prevW);
    const usedE = Math.max(0, currE - prevE);

    const costW = usedW * 25;
    const costE = usedE * 7;
    const total = room.price + costW + costE;

    calcRoomPrice.textContent = `฿${room.price}`;
    calcWaterCost.textContent = `฿${costW} (${usedW} ยูนิต)`;
    calcElecCost.textContent = `฿${costE} (${usedE} หน่วย)`;
    calcTotalCost.textContent = `฿${total}`;
  }

  billForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = document.getElementById('billId').value;
    const roomId = billRoomSel.value;
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const prevW = parseFloat(document.getElementById('prevWater').value) || 0;
    const currW = parseFloat(document.getElementById('currWater').value) || 0;
    const prevE = parseFloat(document.getElementById('prevElec').value) || 0;
    const currE = parseFloat(document.getElementById('currElec').value) || 0;

    const usedW = Math.max(0, currW - prevW);
    const usedE = Math.max(0, currE - prevE);

    const costW = usedW * 25;
    const costE = usedE * 7;
    const total = room.price + costW + costE;

    const newBill = {
      id: idVal ? parseInt(idVal) : Date.now(),
      room: roomId,
      month: document.getElementById('billMonth').value,
      year: document.getElementById('billYear').value,
      roomPrice: room.price,
      prevWater: prevW,
      currWater: currW,
      waterCost: costW,
      prevElec: prevE,
      currElec: currE,
      elecCost: costE,
      total: total
    };

    if (idVal) {
      const idx = bills.findIndex(b => b.id === parseInt(idVal));
      if (idx !== -1) bills[idx] = newBill;
    } else {
      bills.push(newBill);
    }

    roomMeters[roomId] = { water: currW, elec: currE };

    closeBillModal();
    renderBills();
  });

  function deleteBill(id) {
    if (confirm('คุณต้องการลบบิลนี้ใช่หรือไม่?')) {
      bills = bills.filter(b => b.id !== id);
      renderBills();
    }
  }

  function openEditBill(id) {
    const b = bills.find(x => x.id === id);
    if (!b) return;
    populateRoomOptions();
    billForm.reset();
    document.getElementById('billModalTitle').textContent = 'แก้ไขบิล';
    document.getElementById('billId').value = b.id;
    billRoomSel.value = b.room;
    document.getElementById('billMonth').value = b.month;
    document.getElementById('billYear').value = b.year;
    document.getElementById('prevWater').value = b.prevWater;
    document.getElementById('currWater').value = b.currWater;
    document.getElementById('prevElec').value = b.prevElec;
    document.getElementById('currElec').value = b.currElec;

    calculatePreview();
    billModal.classList.remove('hidden');
    billModal.classList.add('flex');
  }

  const billDetailsModal = document.getElementById('billDetailsModal');
  function showBillDetails(id) {
    const b = bills.find(x => x.id === id);
    if (!b) return;
    const content = document.getElementById('billDetailsContent');
    content.innerHTML = `
      <div class="flex justify-between border-b pb-2">
        <span class="font-medium text-gray-500">ห้องพัก:</span>
        <span class="font-bold text-gray-800">ห้อง ${b.room}</span>
      </div>
      <div class="flex justify-between border-b pb-2 pt-2">
        <span class="font-medium text-gray-500">รอบบิล:</span>
        <span class="font-bold text-gray-800">${b.month} ${b.year}</span>
      </div>
      <div class="flex justify-between border-b pb-2 pt-2">
        <span class="font-medium text-gray-500">ค่าห้องพัก:</span>
        <span class="text-gray-800">฿${b.roomPrice}</span>
      </div>
      <div class="flex justify-between border-b pb-2 pt-2">
        <span class="font-medium text-gray-500">ค่าน้ำ (${Math.max(0, b.currWater - b.prevWater)} ยูนิต):</span>
        <span class="text-gray-800">฿${b.waterCost}</span>
      </div>
      <div class="flex justify-between border-b pb-2 pt-2">
        <span class="font-medium text-gray-500">ค่าไฟ (${Math.max(0, b.currElec - b.prevElec)} หน่วย):</span>
        <span class="text-gray-800">฿${b.elecCost}</span>
      </div>
      <div class="flex justify-between pt-2 mt-2">
        <span class="font-bold text-lg text-gray-800">รวมทั้งหมด:</span>
        <span class="font-bold text-lg text-green-600">฿${b.total}</span>
      </div>
    `;
    billDetailsModal.classList.remove('hidden');
    billDetailsModal.classList.add('flex');
  }

  document.getElementById('closeBillDetailsBtn')?.addEventListener('click', () => {
    billDetailsModal.classList.remove('flex');
    billDetailsModal.classList.add('hidden');
  });

  // Render users
  function renderUsers() {
    const container = document.getElementById('usersList');
    if (!container) return;
    container.innerHTML = '';
    users.forEach(u => {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 rounded shadow flex items-center justify-between';
      div.innerHTML = `
        <div class="space-y-1">
          <div class="font-medium text-lg text-gray-800">ห้อง ${u.room}</div>
          <div class="text-sm text-gray-600">ชื่อผู้ใช้: <span class="font-medium">${u.username}</span></div>
          <div class="text-sm text-gray-600">รหัสผ่าน: <span class="font-medium">${u.password}</span></div>
        </div>
        <div>
          <button data-id="${u.id}" class="delete-user px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium transition-colors">ลบ</button>
        </div>
      `;
      container.appendChild(div);
    });

    container.querySelectorAll('.delete-user').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteUser(parseInt(btn.dataset.id));
      });
    });
  }

  function deleteUser(id) {
    if (confirm('คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?')) {
      users = users.filter(u => u.id !== id);
      renderUsers();
    }
  }

  // --- User Modal & Logic ---
  const userModal = document.getElementById('userModal');
  const userForm = document.getElementById('userForm');
  const userRoomSel = document.getElementById('userRoom');

  function populateUserRoomOptions() {
    if (!userRoomSel) return;
    userRoomSel.innerHTML = '<option value="">-- เลือกห้อง --</option>';
    rooms.forEach(r => {
      userRoomSel.innerHTML += `<option value="${r.id}">${r.id}</option>`;
    });
  }

  document.getElementById('showAddUserModal')?.addEventListener('click', () => {
    populateUserRoomOptions();
    userForm.reset();
    userModal.classList.remove('hidden');
    userModal.classList.add('flex');
  });

  document.getElementById('cancelUserBtn')?.addEventListener('click', closeUserModal);

  function closeUserModal() {
    if (userModal) {
      userModal.classList.remove('flex');
      userModal.classList.add('hidden');
    }
  }

  userForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const roomId = userRoomSel.value;

    // Check if room already has a user
    const existingUser = users.find(u => u.room === roomId);
    if (existingUser) {
      alert(`ไม่สามารถเพิ่มผู้ใช้งานได้ เนื่องจากมีผู้ใช้งานในห้อง ${roomId} อยู่แล้ว`);
      return;
    }

    const username = document.getElementById('userUsername').value;
    const password = document.getElementById('userPassword').value;

    const newUser = {
      id: Date.now(),
      room: roomId,
      username: username,
      password: password
    };
    users.push(newUser);
    closeUserModal();
    renderUsers();
  });

  // --- Contract Modal & Logic ---
  function renderContracts() {
    const container = document.getElementById('contractsList');
    if (!container) return;
    const filterVal = document.getElementById('filterContracts')?.value; // YYYY-MM
    container.innerHTML = '';

    let filtered = contracts;
    if (filterVal) {
      filtered = filtered.filter(c => c.uploadDate && c.uploadDate.startsWith(filterVal));
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div class="text-gray-500 text-center py-4">ไม่พบข้อมูลในเดือนที่เลือก</div>';
    }

    filtered.forEach(c => {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center justify-between gap-4';
      div.innerHTML = `
        <div class="space-y-1">
          <div class="font-medium text-lg text-gray-800">ห้อง ${c.room}</div>
          <div class="text-sm text-gray-600">วันที่อัปโหลด: <span class="font-medium">${new Date(c.uploadDate).toLocaleDateString('th-TH')}</span></div>
          <div class="text-sm text-gray-600">ชื่อไฟล์: <span class="font-medium truncate max-w-[200px] inline-block align-bottom">${c.fileName}</span></div>
        </div>
        <div class="flex items-center gap-2">
          <a href="${c.fileUrl}" target="_blank" class="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors">ดูไฟล์</a>
          <a href="${c.fileUrl}" download="${c.fileName}" class="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm font-medium transition-colors">ดาวน์โหลด</a>
        </div>
      `;
      container.appendChild(div);
    });
  }

  const contractModal = document.getElementById('contractModal');
  const contractForm = document.getElementById('contractForm');
  const contractRoomSel = document.getElementById('contractRoom');

  function populateContractRoomOptions() {
    if (!contractRoomSel) return;
    contractRoomSel.innerHTML = '<option value="">-- เลือกห้อง --</option>';
    rooms.forEach(r => {
      contractRoomSel.innerHTML += `<option value="${r.id}">${r.id}</option>`;
    });
  }

  document.getElementById('showAddContractModal')?.addEventListener('click', () => {
    populateContractRoomOptions();
    contractForm.reset();
    contractModal.classList.remove('hidden');
    contractModal.classList.add('flex');
  });

  document.getElementById('cancelContractBtn')?.addEventListener('click', closeContractModal);

  function closeContractModal() {
    if (contractModal) {
      contractModal.classList.remove('flex');
      contractModal.classList.add('hidden');
    }
  }

  contractForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const roomId = contractRoomSel.value;
    const fileInput = document.getElementById('contractFile');

    // Check if a contract already exists for the room (Optional but good practice)
    const existingContract = contracts.find(c => c.room === roomId);
    if (existingContract) {
      if (!confirm(`ห้อง ${roomId} มีสัญญาเช่าอยู่แล้ว ต้องการเพิ่มใหม่อีกหรือไม่?`)) {
        return;
      }
    }

    if (fileInput.files.length === 0) return;
    const file = fileInput.files[0];

    const newContract = {
      id: Date.now(),
      room: roomId,
      uploadDate: new Date().toISOString(),
      fileName: file.name,
      fileUrl: URL.createObjectURL(file) // จำลองลิงก์ไฟล์ หรือใช้ data URI จาก FileReader สำหรับตัวอย่างนี้ URL.createObjectURL เพียงพอที่จะเปิดแท็บใหม่ / ให้ดาวน์โหลดในเซสชันเดียวกันได้
    };

    contracts.push(newContract);
    closeContractModal();
    renderContracts();
  });

  // Attach filter event listeners
  document.getElementById('filterRequests')?.addEventListener('change', renderRequests);
  document.getElementById('filterPayments')?.addEventListener('change', renderPayments);
  document.getElementById('filterContracts')?.addEventListener('change', renderContracts);

  // Initial render
  renderCounts(); renderRooms(); renderRequests(); renderBills(); renderPayments(); renderUsers(); renderContracts(); renderChart(); renderRecentRequests();
  showPage('dashboard');
});
