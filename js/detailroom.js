const API_URL = "http://localhost:3000/api/rooms";

let currentImageIndex = 0;

const images = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200"
];

function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
async function loadRoomData() {
  const roomId = getQueryParameter("room");

  if (!roomId) {
    document.body.innerHTML = "<h1 class='text-3xl font-bold text-red-600 text-center mt-10'>ไม่พบ Room ID</h1>";
    return;
  }

  try {
    console.log("เริ่มโหลดห้อง:", roomId);

    const response = await fetch(`${API_URL}/${roomId}`);
    if (!response.ok) {
      throw new Error(`โหลดห้อง ${roomId} ไม่สำเร็จ: ${response.status}`);
    }

    const room = await response.json();
    console.log("ข้อมูลห้องจาก API:", room);

    const price = Number(room.RPRICE) || 0;
    const deposit = price + 2500;

    const h1 = document.querySelector("h1");
    if (h1) h1.textContent = `ห้อง ${room.ROOMID}`;

    const priceElement = document.querySelector(".text-3xl.font-bold.mb-4");
    if (priceElement) priceElement.textContent = `฿${price.toLocaleString()}/เดือน`;

    const depositElement = document.querySelector(".text-xl.font-semibold.mb-2");
    if (depositElement) depositElement.textContent = `ยอดชำระค่าเงินมัดจำการจองห้องพัก: ฿${deposit.toLocaleString()}`;

    const contractElement = document.querySelector(".text-xl.font-semibold.mb-6");
    if (contractElement) contractElement.textContent = `ยอดที่ต้องชำระในวันทำสัญญา: ฿${price.toLocaleString()}`;

       // อัปเดตสถานะ badge + ปิดปุ่มจอง (selector ปรับให้ตรงกับ HTML ของคุณ)
    // Badge อยู่ใน div flex justify-between ข้าง h1
    const badgeContainer = document.querySelector(".flex.items-start.justify-between");
    const badge = badgeContainer ? badgeContainer.querySelector("span") : null;

    // ปุ่มจองเป็น button w-full bg-green-700 (จาก HTML ของคุณ)
    const bookBtn = document.querySelector("button.w-full.bg-green-700");

    console.log("พบ badge container:", badgeContainer ? badgeContainer.outerHTML : "ไม่พบ");
    console.log("พบ badge:", badge ? badge.outerHTML : "ไม่พบ badge");
    console.log("พบปุ่มจอง:", bookBtn ? bookBtn.outerHTML : "ไม่พบปุ่มจอง");

    if (badge) {
      if (room.RSTATUS === "AVAILABLE") {
        badge.textContent = "ว่าง";
        badge.className = "bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm";
      } else {
        badge.textContent = "เต็ม";
        badge.className = "bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold text-sm";

        if (bookBtn) {
          bookBtn.disabled = true;
          bookBtn.textContent = "ห้องเต็ม ไม่สามารถจองได้";
          bookBtn.classList.remove("bg-green-700", "hover:bg-green-800");
          bookBtn.classList.add("bg-gray-400", "cursor-not-allowed");
          console.log("ปิดปุ่มจองเรียบร้อยแล้ว");
        }
      }
    } else {
      console.warn("ไม่พบ badge สถานะเลย!");
    }

    updateImage();

  } catch (err) {
    console.error("Error loading room:", err);
    alert("โหลดข้อมูลห้องไม่สำเร็จ: " + err.message);
  }
}

function goToBooking() {
  const roomId = getQueryParameter("room");
  window.location.href = `booking.html?room=${roomId}`;
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
  const mainImg = document.getElementById("mainImage");
  if (mainImg) {
    mainImg.src = images[currentImageIndex];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadRoomData();

  const menuBtn = document.getElementById("menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      document.getElementById("mobileMenu")?.classList.toggle("hidden");
    });
  }

});
