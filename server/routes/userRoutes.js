const express = require('express');
const { getUsersForSidebar, getChats, searchUsers, getUserById } = require('../controllers/userController');
const { protectRoute } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users - All users (for sidebar display)
router.get("/", protectRoute, getUsersForSidebar);

// GET /api/users/chats - Only users I have chatted with (recent chats)
router.get("/chats", protectRoute, getChats);

// GET /api/users/search?q=query - Search users by name/username
router.get("/search", protectRoute, searchUsers);

// GET /api/users/:id - Get a specific user by ID
router.get("/:id", protectRoute, getUserById);

module.exports = router;
