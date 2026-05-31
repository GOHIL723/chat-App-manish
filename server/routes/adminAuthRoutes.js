const express = require('express');
const { adminLogin, adminLogout, getAdminMe } = require('../controllers/adminAuthController');
const { protectRoute } = require('../middleware/authMiddleware');
const { adminRoute } = require('../middleware/adminMiddleware');

const router = express.Router();

// Admin login — public (no auth needed)
router.post('/login', adminLogin);

// Admin logout — must be logged in
router.post('/logout', protectRoute, adminLogout);

// Get current admin session info
router.get('/me', protectRoute, adminRoute, getAdminMe);

module.exports = router;
