const express = require("express");
const router = express.Router();

const contractController = require("../controllers/contractController");

const multer = require("multer");
const path = require("path");


// =============================
// CONFIG UPLOAD
// =============================
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);

  }

});

const upload = multer({ storage });


// =============================
// ROUTES
// =============================

router.get("/", contractController.getAllContracts);

router.post(
  "/",
  upload.single("contractFile"),
  contractController.createContract
);

router.get(
  "/download/:file",
  contractController.downloadContract
);

module.exports = router;