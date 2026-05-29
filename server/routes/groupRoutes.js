const express = require('express');
const {
    createGroup, getMyGroups, getGroupById,
    getGroupMessages, sendGroupMessage,
    addMembers, removeMember, updateGroup,
    leaveGroup, getGroupMedia
} = require('../controllers/groupController');
const { protectRoute } = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/", protectRoute, getMyGroups);
router.post("/", protectRoute, createGroup);
router.get("/:id", protectRoute, getGroupById);
router.put("/:id", protectRoute, updateGroup);
router.get("/:id/messages", protectRoute, getGroupMessages);
router.post("/:id/messages", protectRoute, sendGroupMessage);
router.post("/:id/members", protectRoute, addMembers);
router.delete("/:id/members/:userId", protectRoute, removeMember);
router.post("/:id/leave", protectRoute, leaveGroup);
router.get("/:id/media", protectRoute, getGroupMedia);

module.exports = router;
