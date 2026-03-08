const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.post('/', billController.createBill);

router.get('/', billController.getAllBills);

router.get('/room/:roomId', billController.getBillsByRoom);

router.get('/member/:accId', billController.getBillsByAccId);

router.get('/last/:roomId', billController.getLastBillByRoom);

router.post('/pay', billController.payBill);

router.put('/:billId', billController.updateBill);   // ✅ แก้ตรงนี้

router.delete('/:billId', billController.deleteBill);

module.exports = router;