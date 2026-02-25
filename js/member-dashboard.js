document.addEventListener('DOMContentLoaded', () => {

  // Mock data
  const member = { username: 'user_a1', roomNumber: 'ห้อง A1' };
  let expenses = [
    { id: 1, month: 'กุมภาพันธ์', year: 2026, dueDate: '2026-03-05', roomRent: 3000, electricityCost: 350, waterCost: 125, otherCharges: 0, total: 3475, paymentStatus: 'pending', slipUrl: null },
    { id: 2, month: 'มกราคม', year: 2026, dueDate: '2026-02-05', roomRent: 3000, electricityCost: 400, waterCost: 150, otherCharges: 0, total: 3550, paymentStatus: 'paid', slipUrl: null },
    { id: 3, month: 'ธันวาคม', year: 2025, dueDate: '2026-01-05', roomRent: 3000, electricityCost: 380, waterCost: 120, otherCharges: 0, total: 3500, paymentStatus: 'paid', slipUrl: null }
  ];

  // App state
  let activePage = 'dashboard';
  let uploadedSlip = null; // data URL
  let uploadedFile = null;
  let paymentMethod = 'account'; // 'account' or 'qr'

  // Element refs
  const mainContent = document.getElementById('mainContent');
  const desktopRoomNumber = document.getElementById('desktopRoomNumber');
  const mobileRoomNumber = document.getElementById('mobileRoomNumber');
  const memberUsernameEl = document.getElementById('memberUsername');
  const slipModal = document.getElementById('slipModal');
  const slipContainer = document.getElementById('slipContainer');
  const pageBtns = document.querySelectorAll('.page-btn');

  // Init member info
  if (desktopRoomNumber) desktopRoomNumber.textContent = member.roomNumber;
  if (mobileRoomNumber) mobileRoomNumber.textContent = member.roomNumber;
  if (memberUsernameEl) memberUsernameEl.textContent = member.username;

  // Navigation
  pageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activePage = btn.dataset.page;
      render();
      closeMobileSidebar();
    });
  });

  window.setPaymentMethod = function (m) { paymentMethod = m; render(); }
  window.goTo = function (page) {
    activePage = page;
    render();
  }
  window.clearUpload = function () { uploadedSlip = null; uploadedFile = null; render(); }
  window.submitPayment = function () {
    const current = getCurrentExpense();
    if (!uploadedSlip || !current) { alert('กรุณาอัปโหลดสลิปการโอนเงิน'); return; }
    expenses = expenses.map(e => e.id === current.id ? { ...e, paymentStatus: 'pending', slipUrl: uploadedSlip } : e);
    uploadedSlip = null; uploadedFile = null; activePage = 'dashboard';
    alert('ส่งสลิปการชำระเงินเรียบร้อยแล้ว รอการตรวจสอบจากแอดมิน');
    render();
  }
  window.viewSlip = function (url) {
    slipContainer.innerHTML = `<img src="${url}" alt="Payment slip" class="max-w-full h-auto rounded-lg object-contain w-full h-full max-h-[70vh]" />`;
    slipModal.classList.remove('hidden');
    slipModal.classList.add('flex');
  }

  document.getElementById('closeSlip')?.addEventListener('click', () => {
    slipModal.classList.add('hidden');
    slipModal.classList.remove('flex');
  });

  function getCurrentExpense() {
    return expenses.find(e => e.paymentStatus === 'pending') || null;
  }

  function renderDashboard() {
    const current = getCurrentExpense();
    let html = `<h2 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 tracking-tight">ภาพรวมแดชบอร์ด</h2>`;

    if (current) {
      html += `
      <div class="bg-gradient-to-br from-green-600 via-green-700 to-green-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-56 h-56 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div class="absolute -left-16 -bottom-16 w-56 h-56 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div class="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h3 class="text-xl sm:text-2xl font-bold mb-1 opacity-90">ยอดชำระเดือนปัจจุบัน</h3>
            <div class="text-green-100 font-medium tracking-wide">${current.month} ${current.year}</div>
          </div>
          <div class="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/20 text-sm flex items-center shadow-inner">
            <svg class="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ครบกำหนด: <span class="font-bold ml-2 text-white">${current.dueDate}</span>
          </div>
        </div>
        
        <div class="relative z-10 space-y-3 sm:space-y-4 mb-8 bg-black/20 rounded-2xl p-5 sm:p-6 backdrop-blur-sm border border-white/10 shadow-inner">
          <div class="flex justify-between items-center pb-3 border-b border-white/10 group">
            <span class="text-green-50 group-hover:text-white transition-colors">ค่าห้องพัก</span><span class="font-semibold text-lg tracking-wide">฿${current.roomRent.toLocaleString()}</span>
          </div>
          <div class="flex justify-between items-center pb-3 border-b border-white/10 group">
            <span class="text-green-50 group-hover:text-white transition-colors">ค่าไฟฟ้า</span><span class="font-semibold text-lg tracking-wide">฿${current.electricityCost.toLocaleString()}</span>
          </div>
          <div class="flex justify-between items-center pb-3 border-b border-white/10 group">
            <span class="text-green-50 group-hover:text-white transition-colors">ค่าน้ำประปา</span><span class="font-semibold text-lg tracking-wide">฿${current.waterCost.toLocaleString()}</span>
          </div>
          <div class="flex justify-between items-center group">
            <span class="text-green-50 group-hover:text-white transition-colors">ค่าใช้จ่ายอื่นๆ</span><span class="font-semibold text-lg tracking-wide">฿${current.otherCharges.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-lg text-green-100 font-medium">ยอดชำระรวมทั้งสิ้น</div>
          <div class="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">฿${current.total.toLocaleString()}</div>
        </div>
      </div>
      
      <button class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 px-10 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:ring-4 focus:ring-green-500/50 focus:outline-none" onclick="goTo('payment')">
        ชำระเงินทันที
      </button>
    `;
    } else {
      html += `
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 sm:p-16 text-center transform transition duration-500 hover:scale-[1.01]">
        <div class="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-3">ไม่มียอดค้างชำระ!</h3>
        <p class="text-gray-500 text-lg max-w-md mx-auto">คุณได้ชำระค่าใช้จ่ายทั้งหมดในรอบบิลนี้เรียบร้อยแล้ว ขอบคุณที่ใช้บริการครับ</p>
      </div>
    `;
    }
    return html;
  }

  function renderPayment() {
    const current = getCurrentExpense();
    function toBuddhistYear(y) { return y + 543; }
    function fmtAmt(n) { return '฿' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

    if (!current) {
      return `<div class="bg-white p-12 text-center rounded-3xl shadow-sm border border-gray-100">
      <div class="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
         <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">ไม่มีค่าที่ต้องชำระ</h3>
      <div class="text-gray-500 mb-8 max-w-sm mx-auto">ขณะนี้ยังไม่มีรอบบิลใหม่ที่ต้องชำระเงิน</div>
      <button class="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition shadow-sm" onclick="goTo('dashboard')">กลับหน้าหลัก</button>
    </div>`;
    }

    const buddhistYear = toBuddhistYear(current.year);
    const total = fmtAmt(current.total);
    const room = member.roomNumber || '';
    const accActive = paymentMethod === 'account';
    const qrActive = paymentMethod === 'qr';

    let html = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">ชำระค่าใช้จ่าย</h2>
        <div class="text-gray-500 mt-2 font-medium flex items-center gap-2">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
           รอบบิล: <span class="text-gray-700">${current.month} ${buddhistYear}</span>
        </div>
      </div>
      <button class="self-start sm:self-auto text-sm px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition shadow-sm flex items-center gap-2" onclick="goTo('dashboard')">
         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
         ย้อนกลับ
      </button>
    </div>
    
    <div class="flex flex-col lg:flex-row gap-8 items-start">
      
      <!-- Payment Form Area -->
      <div class="flex-1 w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h3 class="font-bold text-xl mb-5 text-gray-800 flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">1</span>
          ช่องทางการชำระเงิน
        </h3>
        
        <div class="flex gap-2 mb-8 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100">
          <button class="flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${accActive ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-green-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}" onclick="setPaymentMethod('account')">โอนผ่านเลขบัญชี</button>
          <button class="flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${qrActive ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-green-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}" onclick="setPaymentMethod('qr')">สแกน QR Code</button>
        </div>
        
        <div class="bg-gray-50/50 border border-gray-100 rounded-2xl p-8 mb-10 flex justify-center items-center min-h-[280px] shadow-inner">
  `;

    if (accActive) {
      html += `
          <div class="text-center w-full max-w-sm">
            <div class="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            </div>
            <div class="text-4xl font-bold tracking-widest text-gray-900 mb-4 font-mono select-all bg-white py-3 rounded-xl shadow-sm border border-gray-100">409-573-8599</div>
            <div class="text-xl font-medium text-gray-800 mb-2">ญาทิชา จันทรศรีสุริยวงศ์</div>
            <div class="text-gray-500 flex items-center justify-center gap-2">
               <span class="w-3 h-3 rounded-full bg-green-500"></span> ธนาคารไทยพาณิชย์
            </div>
          </div>
    `;
    } else {
      const qrData = encodeURIComponent(`GreenStay:${member.roomNumber}:${total}`);
      const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData}&color=16a34a`;
      html += `
          <div class="text-center w-full max-w-sm">
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 inline-block mb-6 relative group">
              <div class="absolute inset-0 border-2 border-green-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity scale-105 pointer-events-none"></div>
              <img src="${qrSrc}" alt="QR Code" class="w-56 h-56 mx-auto mix-blend-multiply">
            </div>
            <div class="font-bold text-gray-800 text-lg mb-1">สแกนเพื่อชำระผ่านแอปธนาคาร</div>
            <div class="text-gray-500 text-sm mb-4">รองรับทุกธนาคารในประเทศไทย</div>
            <div class="bg-green-50 text-green-700 py-2 px-6 rounded-full inline-block font-bold text-xl border border-green-100">${total}</div>
          </div>
    `;
    }

    html += `
        </div>
        
        <h3 class="font-bold text-xl mb-5 text-gray-800 flex items-center gap-2">
          <span class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">2</span>
          อัปโหลดหลักฐานการโอนเงิน
        </h3>
  `;

    if (!uploadedSlip) {
      html += `
        <label class="block cursor-pointer group">
          <div class="border-2 border-dashed border-gray-300 group-hover:border-green-400 bg-gray-50 group-hover:bg-green-50/30 transition-all duration-300 rounded-2xl p-10 text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
               <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
            <span class="block text-lg font-medium text-gray-700 group-hover:text-green-700 transition-colors">คลิกเพื่อเลือกจำลองไฟล์สลิป</span>
            <span class="mt-2 block text-sm text-gray-500">รองรับไฟล์รูปภาพ (JPG, PNG) เท่านั้น</span>
          </div>
          <input type="file" id="fileInput" accept="image/*" class="hidden">
        </label>
    `;
    } else {
      html += `
        <div class="relative bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center shadow-inner">
          <img src="${uploadedSlip}" class="max-h-80 object-contain mx-auto rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100" alt=" slip">
          <button onclick="clearUpload()" class="absolute top-4 right-4 bg-white/90 backdrop-blur text-red-600 hover:text-white hover:bg-red-500 p-2.5 rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/30" title="ลบรูปภาพ">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
    `;
    }

    html += `
        <button class="w-full mt-10 bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:ring-4 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" onclick="submitPayment()" ${!uploadedSlip ? 'disabled' : ''}>
          ยืนยันการชำระเงิน
        </button>
        ${!uploadedSlip ? '<p class="text-center text-sm text-gray-400 mt-3">กรุณาอัปโหลดสลิปเพื่อยืนยัน</p>' : ''}
      </div>
      
      <!-- Summary Area -->
      <div class="w-full lg:w-80 xl:w-96 shrink-0">
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
          <h3 class="font-bold text-xl mb-6 text-gray-800 border-b pb-4">สรุปยอดชำระ</h3>
          
          <div class="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-6 text-sm font-medium border border-gray-100">
            <span class="text-gray-500">รหัสห้องพัก</span>
            <span class="text-gray-900 font-bold bg-white px-3 py-1 rounded shadow-sm">${room}</span>
          </div>
          
          <div class="space-y-4 text-base">
            <div class="flex justify-between items-center group">
              <span class="text-gray-600 flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-green-500 transition-colors"></div> ค่าเช่าห้อง</span>
              <span class="font-medium text-gray-900">${fmtAmt(current.roomRent)}</span>
            </div>
            <div class="flex justify-between items-center group">
              <span class="text-gray-600 flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-green-500 transition-colors"></div> ค่าไฟฟ้า</span>
              <span class="font-medium text-gray-900">${fmtAmt(current.electricityCost)}</span>
            </div>
            <div class="flex justify-between items-center group">
              <span class="text-gray-600 flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-green-500 transition-colors"></div> ค่าน้ำประปา</span>
              <span class="font-medium text-gray-900">${fmtAmt(current.waterCost)}</span>
            </div>
            <div class="flex justify-between items-center group">
              <span class="text-gray-600 flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-green-500 transition-colors"></div> อื่นๆ</span>
              <span class="font-medium text-gray-900">${fmtAmt(current.otherCharges)}</span>
            </div>
          </div>
          
          <div class="mt-8 pt-6 border-t border-gray-100 border-dashed flex flex-col items-center text-center">
            <span class="font-bold text-gray-500 text-sm mb-1">ยอดรวมที่ต้องชำระทั้งสิ้น</span>
            <span class="text-4xl font-extrabold text-green-600 tracking-tight">${total}</span>
          </div>
        </div>
      </div>
      
    </div>
  `;
    return html;
  }

  function renderHistory() {
    function toBuddhistYear(y) { return y + 543; }
    function fmtAmt(n) { return '฿' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

    const filterVal = document.getElementById('filterHistory')?.value; // YYYY-MM
    let filteredExpenses = expenses;

    // We mock the filter since we don't have true YYYY-MM strings in 'month' data easily comparable without converting.
    // Let's assume real data would have a 'date' field. For now, we will add a naive filter by assuming the year input.
    if (filterVal) {
      const parts = filterVal.split('-');
      const y = parseInt(parts[0], 10);
      const mInt = parseInt(parts[1], 10);
      const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
      const mStr = thaiMonths[mInt - 1];
      filteredExpenses = expenses.filter(e => e.year === y && e.month === mStr);
    }

    let html = `
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">ประวัติการชำระเงิน</h2>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">เดือน/ปี:</label>
        <input type="month" id="filterHistory" class="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm shadow-sm" value="${filterVal || ''}" onchange="renderHistoryFilter(this.value)" />
      </div>
    </div>
    
    <div class="space-y-3" id="historyListContainer">
  `;

    if (filteredExpenses.length === 0) {
      html += '<div class="text-gray-500 text-center py-8 bg-white rounded-2xl border border-gray-100 shadow-sm">ไม่พบข้อมูลประวัติในเดือนที่เลือก</div>';
    }

    filteredExpenses.slice().reverse().forEach(exp => {
      const buddhistYear = toBuddhistYear(exp.year);
      const amount = fmtAmt(exp.total);
      const month = exp.month;

      const slipCell = exp.slipUrl
        ? `<button class="text-green-600 bg-green-50 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center gap-2 shrink-0 group shadow-sm border border-green-100 hover:border-transparent" onclick="viewSlip('${exp.slipUrl}')">
          <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> 
          <span class="hidden sm:inline">ดูสลิป</span>
        </button>`
        : `<span class="text-gray-400 text-sm font-medium bg-gray-50 px-4 py-2 inline-block rounded-lg shrink-0">ไม่มีข้อมูล</span>`;

      html += `
        <div class="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:shadow-md">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
             </div>
             <div>
               <div class="text-sm text-gray-500 mb-1">รอบบิล</div>
               <div class="font-bold text-gray-900 text-lg">${month} <span class="text-gray-600 font-normal ml-1">${buddhistYear}</span></div>
             </div>
          </div>
          <div class="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
             <div class="text-left sm:text-right">
                <div class="text-sm text-gray-500 mb-1">จำนวนเงิน</div>
                <div class="font-bold text-green-700 text-xl tracking-tight">${amount}</div>
             </div>
             <div>
                <div class="text-sm text-gray-500 mb-1 hidden sm:block text-right">หลักฐาน</div>
                ${slipCell}
             </div>
          </div>
        </div>
      `;
    });

    html += `
    </div>
  `;

    // Update just the container if it's a filter re-render, otherwise return html
    const container = document.getElementById('historyListContainer');
    if (container) {
      // Create a temporary div to extract just the list part to avoid replacing the header input causing focus loss
      const match = html.match(/<div class="space-y-3" id="historyListContainer">([\s\S]*?)<\/div>\s*$/);
      if (match) {
        container.innerHTML = match[1];
      }
      return ''; // Returning empty string to signal it was handled via DOM update
    }

    return html;
  }

  // Handle filter globally
  window.renderHistoryFilter = function (val) {
    if (activePage === 'history') {
      renderHistory();
    }
  }

  function render() {
    if (activePage === 'dashboard') mainContent.innerHTML = renderDashboard();
    if (activePage === 'payment') mainContent.innerHTML = renderPayment();
    if (activePage === 'history') mainContent.innerHTML = renderHistory();

    pageBtns.forEach(b => {
      b.classList.remove('bg-green-50', 'text-green-800');
      b.classList.add('text-gray-700', 'hover:bg-gray-50');

      // Active state
      if (b.dataset.page === activePage || (activePage === 'payment' && b.dataset.page === 'dashboard')) {
        b.classList.remove('text-gray-700', 'hover:bg-gray-50');
        b.classList.add('bg-green-50', 'text-green-800');
      }
    });

    // Attach file listener
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) { uploadedSlip = ev.target.result; uploadedFile = file; render(); };
        reader.readAsDataURL(file);
      });
    }
  }

  // Mobile sidebar logic
  const mobileSidebar = document.getElementById('mobileSidebar');
  const mobileSidebarPanel = document.getElementById('mobileSidebarPanel');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');

  function openMobileSidebar() {
    if (!mobileSidebar) return;
    mobileSidebar.classList.remove('hidden');
    setTimeout(() => {
      mobileSidebar.classList.remove('opacity-0');
      mobileSidebarPanel.classList.remove('-translate-x-full');
    }, 10);
  }

  function closeMobileSidebar() {
    if (!mobileSidebar) return;
    mobileSidebar.classList.add('opacity-0');
    mobileSidebarPanel.classList.add('-translate-x-full');
    setTimeout(() => {
      mobileSidebar.classList.add('hidden');
    }, 300);
  }

  mobileMenuBtn?.addEventListener('click', openMobileSidebar);
  closeMobileMenuBtn?.addEventListener('click', closeMobileSidebar);
  mobileSidebar?.addEventListener('click', (e) => {
    if (e.target === mobileSidebar) closeMobileSidebar();
  });


  // Init render
  render();

});
