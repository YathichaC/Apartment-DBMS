const express = require("express");
const router = express.Router();

/* IMPORTANT: ต้อง require แบบนี้ */
const roomController = require("../controllers/roomController");

console.log("roomController =", roomController);

router.get("/", roomController.getAllRooms);

router.get("/:id", roomController.getRoomById);
router.put("/:id/status", roomController.updateRoomStatus);

module.exports = router;