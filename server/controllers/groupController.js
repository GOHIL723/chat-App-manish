const Group = require('../models/groupModel');
const GroupMessage = require('../models/groupMessageModel');
const User = require('../models/userModel');
const { io, getReceiverSocketId } = require('../sockets/socket');

// POST /api/groups — Create a new group
const createGroup = async (req, res) => {
    try {
        const { name, description, members, isPrivate } = req.body;
        const adminId = req.user._id;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Group name is required" });
        }

        // Always include admin in members
        const memberIds = [...new Set([adminId.toString(), ...(members || [])])];

        const group = new Group({
            name: name.trim(),
            description: description || "",
            admin: adminId,
            members: memberIds,
            isPrivate: isPrivate !== undefined ? isPrivate : true
        });

        await group.save();

        // Create system message
        await GroupMessage.create({
            groupId: group._id,
            senderId: adminId,
            message: `${req.user.name} created the group`,
            messageType: "system"
        });

        const populated = await Group.findById(group._id)
            .populate('admin', 'name username avatar')
            .populate('members', 'name username avatar')
            .lean();

        // Notify all members via socket
        memberIds.forEach(mId => {
            const sid = getReceiverSocketId(mId);
            if (sid) io.to(sid).emit("groupCreated", populated);
        });

        res.status(201).json(populated);
    } catch (error) {
        console.log("Error in createGroup:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /api/groups — Get all groups the user is a member of
const getMyGroups = async (req, res) => {
    try {
        const userId = req.user._id;

        const groups = await Group.find({ members: userId })
            .populate('admin', 'name username avatar')
            .populate('members', 'name username avatar')
            .sort({ updatedAt: -1 })
            .lean();

        // Attach last message and unread placeholder for each group
        const result = await Promise.all(groups.map(async (g) => {
            const lastMsg = await GroupMessage.findOne({ groupId: g._id })
                .sort({ createdAt: -1 })
                .populate('senderId', 'name username avatar')
                .lean();

            return {
                ...g,
                id: g._id.toString(),
                lastMessage: lastMsg
                    ? (lastMsg.messageType === 'system'
                        ? lastMsg.message
                        : `${lastMsg.senderId?.name || 'Someone'}: ${lastMsg.messageType === 'text' ? lastMsg.message : `Sent a ${lastMsg.messageType}`}`)
                    : "",
                lastMessageTime: lastMsg ? new Date(lastMsg.createdAt).getTime() : new Date(g.createdAt).getTime(),
                time: lastMsg
                    ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ""
            };
        }));

        result.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
        res.status(200).json(result);
    } catch (error) {
        console.log("Error in getMyGroups:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /api/groups/:id — Get group details
const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('admin', 'name username avatar')
            .populate('members', 'name username avatar')
            .lean();

        if (!group) return res.status(404).json({ error: "Group not found" });
        if (!group.members.some(m => m._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ error: "Not a member" });
        }

        res.status(200).json(group);
    } catch (error) {
        console.log("Error in getGroupById:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /api/groups/:id/messages — Get group messages (paginated)
const getGroupMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Verify membership
        const group = await Group.findById(id);
        if (!group || !group.members.some(m => m.toString() === req.user._id.toString())) {
            return res.status(403).json({ error: "Not a member" });
        }

        const total = await GroupMessage.countDocuments({ groupId: id });
        const messages = await GroupMessage.find({ groupId: id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('senderId', 'name username avatar')
            .populate('replyTo')
            .lean();

        messages.reverse();

        res.status(200).json({
            messages,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: page < Math.ceil(total / limit) }
        });
    } catch (error) {
        console.log("Error in getGroupMessages:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// POST /api/groups/:id/messages — Send a group message
const sendGroupMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const senderId = req.user._id;
        const { message, messageType, media, mediaPublicId, mediaMimeType, mediaSize, audioDuration, replyTo } = req.body;

        const group = await Group.findById(id);
        if (!group || !group.members.some(m => m.toString() === senderId.toString())) {
            return res.status(403).json({ error: "Not a member" });
        }

        const newMsg = await GroupMessage.create({
            groupId: id,
            senderId,
            message: message || "",
            messageType: messageType || "text",
            media: media || "",
            mediaPublicId: mediaPublicId || "",
            mediaMimeType: mediaMimeType || "",
            mediaSize: mediaSize || 0,
            audioDuration: audioDuration || 0,
            replyTo: replyTo || null
        });

        const populated = await GroupMessage.findById(newMsg._id)
            .populate('senderId', 'name username avatar')
            .populate('replyTo')
            .lean();

        // Emit to all group members via socket
        group.members.forEach(mId => {
            if (mId.toString() === senderId.toString()) return; // skip sender
            const sid = getReceiverSocketId(mId.toString());
            if (sid) io.to(sid).emit("newGroupMessage", { groupId: id, message: populated });
        });

        // Update group's updatedAt
        group.updatedAt = new Date();
        await group.save();

        res.status(201).json(populated);
    } catch (error) {
        console.log("Error in sendGroupMessage:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// POST /api/groups/:id/members — Add members (admin only)
const addMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberIds } = req.body;
        const group = await Group.findById(id);

        if (!group) return res.status(404).json({ error: "Group not found" });
        if (group.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Only admin can add members" });
        }

        const newMembers = memberIds.filter(m => !group.members.some(e => e.toString() === m));
        if (newMembers.length === 0) return res.status(400).json({ error: "All users are already members" });

        group.members.push(...newMembers);
        await group.save();

        // Create system messages for each new member
        for (const mId of newMembers) {
            const user = await User.findById(mId).select('name');
            await GroupMessage.create({
                groupId: id,
                senderId: req.user._id,
                message: `${req.user.name} added ${user?.name || 'a user'}`,
                messageType: "system"
            });
        }

        const populated = await Group.findById(id)
            .populate('admin', 'name username avatar')
            .populate('members', 'name username avatar')
            .lean();

        // Notify group members
        group.members.forEach(mId => {
            const sid = getReceiverSocketId(mId.toString());
            if (sid) io.to(sid).emit("groupUpdated", populated);
        });

        res.status(200).json(populated);
    } catch (error) {
        console.log("Error in addMembers:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// DELETE /api/groups/:id/members/:userId — Remove a member (admin only)
const removeMember = async (req, res) => {
    try {
        const { id, userId } = req.params;
        const group = await Group.findById(id);

        if (!group) return res.status(404).json({ error: "Group not found" });
        if (group.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Only admin can remove members" });
        }
        if (userId === group.admin.toString()) {
            return res.status(400).json({ error: "Cannot remove admin" });
        }

        const removedUser = await User.findById(userId).select('name');
        group.members = group.members.filter(m => m.toString() !== userId);
        await group.save();

        await GroupMessage.create({
            groupId: id,
            senderId: req.user._id,
            message: `${req.user.name} removed ${removedUser?.name || 'a user'}`,
            messageType: "system"
        });

        const populated = await Group.findById(id)
            .populate('admin', 'name username avatar')
            .populate('members', 'name username avatar')
            .lean();

        // Notify remaining members + removed user
        [...group.members, userId].forEach(mId => {
            const sid = getReceiverSocketId(mId.toString());
            if (sid) io.to(sid).emit("groupUpdated", populated);
        });

        res.status(200).json(populated);
    } catch (error) {
        console.log("Error in removeMember:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// PUT /api/groups/:id — Update group settings (admin only)
const updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isPrivate } = req.body;
        const group = await Group.findById(id);

        if (!group) return res.status(404).json({ error: "Group not found" });
        if (group.admin.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Only admin can update group" });
        }

        if (name) group.name = name.trim();
        if (description !== undefined) group.description = description;
        if (isPrivate !== undefined) group.isPrivate = isPrivate;
        await group.save();

        const populated = await Group.findById(id)
            .populate('admin', 'name username avatar')
            .populate('members', 'name username avatar')
            .lean();

        group.members.forEach(mId => {
            const sid = getReceiverSocketId(mId.toString());
            if (sid) io.to(sid).emit("groupUpdated", populated);
        });

        res.status(200).json(populated);
    } catch (error) {
        console.log("Error in updateGroup:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// POST /api/groups/:id/leave — Leave a group
const leaveGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const group = await Group.findById(id);

        if (!group) return res.status(404).json({ error: "Group not found" });
        if (group.admin.toString() === userId.toString()) {
            return res.status(400).json({ error: "Admin cannot leave. Transfer admin first or delete group." });
        }

        group.members = group.members.filter(m => m.toString() !== userId.toString());
        await group.save();

        await GroupMessage.create({
            groupId: id,
            senderId: userId,
            message: `${req.user.name} left the group`,
            messageType: "system"
        });

        group.members.forEach(mId => {
            const sid = getReceiverSocketId(mId.toString());
            if (sid) io.to(sid).emit("groupUpdated", { ...group.toObject(), _id: group._id });
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in leaveGroup:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET /api/groups/:id/media — Get shared media from group
const getGroupMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await GroupMessage.find({
            groupId: id,
            messageType: { $in: ["image", "voice", "file"] },
            media: { $ne: "" }
        })
            .sort({ createdAt: -1 })
            .limit(30)
            .populate('senderId', 'name username avatar')
            .lean();

        res.status(200).json(media);
    } catch (error) {
        console.log("Error in getGroupMedia:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createGroup, getMyGroups, getGroupById,
    getGroupMessages, sendGroupMessage,
    addMembers, removeMember, updateGroup,
    leaveGroup, getGroupMedia
};
