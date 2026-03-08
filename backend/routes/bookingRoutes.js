const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const multer = require("multer");
const path = require("path");

// กำหนด storage ให้บันทึกลง disk จริง ๆ (เหมือน payments)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "../uploads/slips");
    require("fs").mkdirSync(dest, { recursive: true }); // สร้างโฟลเดอร์ถ้ายังไม่มี
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// จอง + อัปโหลดสลิป
router.post("/create", upload.single("payFile"), bookingController.createBooking);

// แอดมินเห็นเฉพาะคำจองที่รอตรวจ
router.get("/", bookingController.getAllBookings);

// อนุมัติคำจอง (ปุ่มปกติ)
router.put("/approve/:bookingId", bookingController.approveBooking);

// เช็คคำขอรอตรวจ (สำหรับ toggle)
router.get("/pending/:roomId", bookingController.checkPendingForRoom);

// อนุมัติอัตโนมัติเมื่อปิดห้อง
router.post("/auto-approve/:roomId", bookingController.autoApproveForRoom);

// ดูสลิป
router.get("/payments/slip/:bookingId", bookingController.getSlipByBookingId);

module.exports = router;