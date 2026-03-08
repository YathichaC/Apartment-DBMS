const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/slips/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
// -------------------------------------------------------
// CREATE PAYMENT (รองรับหลายชื่อ field)
router.post(
  '/',
  upload.single('payFile'),   // ชื่อหลักที่แนะนำ
  paymentController.createPayment
);

// GET ALL PAYMENTS (Admin)
router.get('/', paymentController.getAllPayments);

// GET SLIP
router.get('/slip/:payId', paymentController.getSlip);

// GET PAYMENTS BY ROOM
router.get('/room/:roomId', paymentController.getPaymentsByRoom);

// GET PAYMENTS BY ACCID (ลูกบ้าน — เฉพาะ RENT)
router.get('/member/:accId', paymentController.getPaymentsByAccId);

module.exports = router;