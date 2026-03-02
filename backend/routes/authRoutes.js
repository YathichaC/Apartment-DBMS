const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ล็อกอินสำหรับลูกบ้าน
router.post('/login', authController.loginTenant);

module.exports = router;