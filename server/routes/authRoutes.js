const express = require('express');
const { login, logout, signup, getMe } = require('../controllers/authController.js');
const { protectRoute } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);

module.exports = router;
