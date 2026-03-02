const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/room/:roomId', billController.getBillsByRoom);

module.exports = router;