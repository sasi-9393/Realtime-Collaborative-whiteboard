const express = require("express");
const { getAllCanvas, createCanvas, loadCanvas, updateCanvas, deleteCanvas, shareCanvas } = require("../controllers/canvasController");
const authMiddleware = require("../middlewares/authenticationMiddleware");

const router = express.Router();

router.get("/load/:id", authMiddleware, loadCanvas);
router.post("/share/:id", authMiddleware, shareCanvas);

// Generic routes LAST
router.get("/", authMiddleware, getAllCanvas);
router.post("/", authMiddleware, createCanvas);
router.put("/:id", authMiddleware, updateCanvas);
router.delete("/:id", authMiddleware, deleteCanvas);

module.exports = router;
