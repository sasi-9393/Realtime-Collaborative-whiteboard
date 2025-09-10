const { userRegister, userLogin, getUserProfile } = require("../controllers/userController");
const express = require("express");
const router = express.Router();


router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/profile", getUserProfile)
module.exports = router;
