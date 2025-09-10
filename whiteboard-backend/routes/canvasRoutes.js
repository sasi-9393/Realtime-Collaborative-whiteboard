const express = require("express");
const { getAllCanvas, createCanvas, loadCanvas, updateCanvas, deleteCanvas } = require("../controllers/canvasController");
const authMiddleware = require("../middlewares/authenticationMiddleware");

const router = express.Router();


router.get("/", authMiddleware, getAllCanvas);
router.post("/", authMiddleware, createCanvas);
router.get("/load/:id", authMiddleware, loadCanvas);
router.put("/:id", authMiddleware, updateCanvas);
router.delete("/:id", authMiddleware, deleteCanvas);
module.exports = router;
