const User = require('../models/userModel');
const Message = require('../models/messageModel');

/**
 * GET /api/users
 * Returns sidebar chat list: users the logged-in user has exchanged messages with,
 * sorted by last message time, with unread counts and last message preview.
 */
const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all users except the logged-in user
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        // Format for the frontend UI: id, name, username, avatar, online, lastMessage, time, unread
        const formattedUsers = await Promise.all(allUsers.map(async (user) => {
            // Find the last message between these two users
            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: loggedInUserId, receiverId: user._id },
                    { senderId: user._id, receiverId: loggedInUserId }
                ]
            }).sort({ createdAt: -1 });

            // Count unread messages sent by this user to the logged-in user
            const unreadCount = await Message.countDocuments({
                senderId: user._id,
                receiverId: loggedInUserId,
                status: { $ne: "seen" }
            });

            return {
                id: user._id.toString(),
                name: user.name,
                username: user.username,
                avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
                online: false, // Updated by frontend using socket online users list
                lastMessage: lastMessage ? (lastMessage.messageType === 'text' ? lastMessage.message : `Sent a ${lastMessage.messageType}`) : "",
                time: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                lastMessageTime: lastMessage ? new Date(lastMessage.createdAt).getTime() : 0,
                unread: unreadCount,
                typing: false
            };
        }));

        // Sort by last message time (descending)
        formattedUsers.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

        res.status(200).json(formattedUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * GET /api/users/chats
 * Returns only users the logged-in user has ACTUALLY chatted with (recent chats list).
 */
const getChats = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all messages involving the logged-in user
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        }).sort({ createdAt: -1 });

        // Extract unique user IDs the logged-in user has chatted with
        const chatUserIds = new Set();
        for (const msg of messages) {
            const otherId = msg.senderId.toString() === loggedInUserId.toString()
                ? msg.receiverId.toString()
                : msg.senderId.toString();
            chatUserIds.add(otherId);
        }

        // Fetch user details and format
        const chatUsers = await Promise.all([...chatUserIds].map(async (userId) => {
            const user = await User.findById(userId).select("-password");
            if (!user) return null;

            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: loggedInUserId, receiverId: user._id },
                    { senderId: user._id, receiverId: loggedInUserId }
                ]
            }).sort({ createdAt: -1 });

            const unreadCount = await Message.countDocuments({
                senderId: user._id,
                receiverId: loggedInUserId,
                status: { $ne: "seen" }
            });

            return {
                id: user._id.toString(),
                name: user.name,
                username: user.username,
                avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
                online: false,
                lastMessage: lastMessage ? (lastMessage.messageType === 'text' ? lastMessage.message : `Sent a ${lastMessage.messageType}`) : "",
                time: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                lastMessageTime: lastMessage ? new Date(lastMessage.createdAt).getTime() : 0,
                unread: unreadCount,
                typing: false
            };
        }));

        // Filter nulls and sort by last message time
        const filtered = chatUsers.filter(Boolean).sort((a, b) => b.lastMessageTime - a.lastMessageTime);

        res.status(200).json(filtered);
    } catch (error) {
        console.log("Error in getChats controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * GET /api/users/search?q=query
 * Search all users by name or username (excludes logged-in user).
 */
const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const loggedInUserId = req.user._id;

        if (!q || q.trim() === "") {
            return res.status(200).json([]);
        }

        const searchRegex = new RegExp(q.trim(), "i");

        const users = await User.find({
            _id: { $ne: loggedInUserId },
            $or: [
                { name: { $regex: searchRegex } },
                { username: { $regex: searchRegex } }
            ]
        }).select("-password").limit(20);

        const formatted = users.map(user => ({
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
            online: false
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.log("Error in searchUsers controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * GET /api/users/:id
 * Get a specific user by their ID.
 */
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        });
    } catch (error) {
        console.log("Error in getUserById controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getUsersForSidebar, getChats, searchUsers, getUserById };
