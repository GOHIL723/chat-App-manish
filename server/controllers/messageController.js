const Message = require('../models/messageModel');
const { getReceiverSocketId, io } = require('../sockets/socket');
const { cloudinary, FOLDERS } = require('../utils/cloudinary');

/**
 * Determines the Cloudinary resource_type and media category from a MIME type.
 */
function resolveMediaType(mimetype) {
    if (mimetype.startsWith('image/')) {
        return { resourceType: 'image', mediaType: 'image' };
    }
    if (mimetype.startsWith('video/')) {
        return { resourceType: 'video', mediaType: 'video' };
    }
    if (mimetype.startsWith('audio/')) {
        // Cloudinary treats audio as 'video' resource type
        return { resourceType: 'video', mediaType: 'voice' };
    }
    // PDF, docs, zip, etc.
    return { resourceType: 'raw', mediaType: 'file' };
}

/**
 * POST /api/messages/upload
 * Upload a media file (image / video / audio / file) to Cloudinary.
 * Returns url, publicId, type, originalName, mimeType, size.
 */
const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        const { resourceType, mediaType } = resolveMediaType(file.mimetype);
        const folder = FOLDERS[mediaType] || 'zenith_chat/misc';

        // ── Debug log ──────────────────────────────────────────────────────
        console.log(`[uploadMedia] File received:`);
        console.log(`  name     : ${file.originalname}`);
        console.log(`  mimetype : ${file.mimetype}`);
        console.log(`  size     : ${file.size} bytes`);
        console.log(`  path     : ${file.path}`);
        console.log(`  mediaType: ${mediaType} | resourceType: ${resourceType}`);

        if (file.size === 0) {
            const fs = require('fs');
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            return res.status(400).json({ error: 'Uploaded file is empty (0 bytes). The recording may have failed.' });
        }
        // ───────────────────────────────────────────────────────────────────

        const public_id = `${Date.now()}_${file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')}`;

        // ─── VOICE: save locally & serve via /uploads (Cloudinary conversion is unreliable) ───
        if (mediaType === 'voice') {
            const fs = require('fs');
            const path = require('path');

            // Ensure /uploads/voices directory exists
            const voiceDir = path.join(__dirname, '../uploads/voices');
            if (!fs.existsSync(voiceDir)) fs.mkdirSync(voiceDir, { recursive: true });

            // Move file to voices directory
            const ext = file.mimetype.includes('ogg') ? 'ogg' : file.mimetype.includes('mp4') ? 'mp4' : 'webm';
            const filename = `${Date.now()}_voice.${ext}`;
            const destPath = path.join(voiceDir, filename);

            fs.renameSync(file.path, destPath);

            // Build public URL (served via express.static in index.js)
            const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
            const host = process.env.SERVER_HOST || `localhost:${process.env.PORT || 5000}`;
            const voiceUrl = `${protocol}://${host}/uploads/voices/${filename}`;

            console.log(`[uploadMedia] Voice saved locally: ${voiceUrl}`);

            return res.status(200).json({
                url: voiceUrl,
                publicId: filename,
                type: 'voice',
                originalName: file.originalname,
                mimeType: `audio/${ext}`,
                size: file.size,
            });
        }

        // ─── IMAGE / VIDEO / FILE: upload to Cloudinary ───────────────────────
        const uploadOptions = {
            resource_type: resourceType,
            folder,
            public_id: public_id,
            overwrite: false,
        };

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_large(file.path, uploadOptions, (error, res) => {
                if (error) reject(error);
                else resolve(res);
            });
        });

        console.log(`[uploadMedia] Cloudinary upload success:`);
        console.log(`  secure_url: ${result.secure_url}`);
        console.log(`  format    : ${result.format}`);



        // Delete the file from local disk after successful upload
        const fs = require('fs');
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        res.status(200).json({
            url: result.secure_url,
            publicId: result.public_id,
            type: mediaType,                  // 'image' | 'video' | 'voice' | 'file'
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
        });
    } catch (error) {
        console.error('Error in uploadMedia controller:', error.message);
        
        // Cleanup file on error
        const fs = require('fs');
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ error: 'Upload failed. Check Cloudinary credentials or file size limits.' });
    }
};

/**
 * POST /api/messages/send/:id
 * Send a message (text / image / video / voice / file) to a user.
 */
const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const { message, messageType, media, mediaPublicId, mediaMimeType, mediaSize, audioDuration, replyTo, isViewOnce } = req.body;

        const Report = require('../models/reportModel');
        const User = require('../models/userModel');

        // Basic Spam Detection
        const spamKeywords = ['win money', 'free iphone', 'click here to claim', 'bitcoin double', 'cash prize'];
        let isSpam = false;
        
        if (messageType === 'text' && message) {
            const lowerMsg = message.toLowerCase();
            isSpam = spamKeywords.some(keyword => lowerMsg.includes(keyword));
        }

        // Rate limiting check: if user sent > 15 messages in the last minute
        const oneMinuteAgo = new Date(Date.now() - 60000);
        const recentMessages = await Message.countDocuments({ 
            senderId, 
            createdAt: { $gte: oneMinuteAgo } 
        });

        if (recentMessages > 15) {
            isSpam = true;
        }

        if (isSpam) {
            // Auto flag user
            await Report.create({
                targetUser: senderId,
                reason: 'Auto-flagged for spam behavior (Keywords or Rate limit exceeded)',
                severity: 'high',
                isSystemGenerated: true
            });
            // If extreme rate limit, auto-suspend
            if (recentMessages > 30) {
                await User.findByIdAndUpdate(senderId, { status: 'Suspended' });
            }
        }

        let newMessage = new Message({
            senderId,
            receiverId,
            message: message || "",
            messageType: messageType || "text",
            media: media || "",
            mediaPublicId: mediaPublicId || "",
            mediaMimeType: mediaMimeType || "",
            mediaSize: mediaSize || 0,
            audioDuration: audioDuration || 0,
            status: "sent",
            replyTo: replyTo || null,
            isViewOnce: isViewOnce || false,
            viewOnceViewed: false
        });

        await newMessage.save();

        // Emit to receiver if online → mark delivered
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            newMessage.status = "delivered";
            await newMessage.save();

            const populatedMessage = await Message.findById(newMessage._id).populate('replyTo').lean();
            io.to(receiverSocketId).emit("newMessage", populatedMessage);
        }

        const populatedForRes = await Message.findById(newMessage._id).populate('replyTo').lean();
        res.status(201).json(populatedForRes);
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * GET /api/messages/:id
 * Paginated message history between logged-in user and another user.
 */
const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const totalCount = await Message.countDocuments({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        });

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('replyTo')
            .lean();

        messages.reverse();

        res.status(200).json({
            messages,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: page < Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * POST /api/messages/seen/:id
 * Mark all messages from a specific sender as seen.
 */
const markMessagesAsSeen = async (req, res) => {
    try {
        const { id: senderId } = req.params;
        const receiverId = req.user._id;

        const result = await Message.updateMany(
            { senderId, receiverId, status: { $ne: "seen" } },
            { $set: { status: "seen" } }
        );

        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messagesSeen", { receiverId });
        }

        res.status(200).json({ success: true, updatedCount: result.modifiedCount });
    } catch (error) {
        console.error("Error in markMessagesAsSeen controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * POST /api/messages/view-once/:messageId
 * Mark a view once photo as viewed (hides the photo)
 */
const markViewOnceAsSeen = async (req, res) => {
    try {
        const { messageId } = req.params;
        const receiverId = req.user._id;

        const message = await Message.findOne({ _id: messageId, receiverId });
        
        if (!message) {
            return res.status(404).json({ error: "Message not found or unauthorized" });
        }

        if (message.isViewOnce && !message.viewOnceViewed) {
            message.viewOnceViewed = true;
            // Optionally, we can also remove the media URL from the DB completely
            // message.media = ""; 
            await message.save();

            // Emit to sender so their UI updates to "Opened"
            const senderSocketId = getReceiverSocketId(message.senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("viewOnceOpened", { messageId });
            }
            // Emit to receiver as well in case they have multiple tabs open
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("viewOnceOpened", { messageId });
            }

            return res.status(200).json({ success: true, message: "Photo marked as viewed" });
        }

        res.status(400).json({ error: "Message is not view once or already viewed" });
    } catch (error) {
        console.error("Error in markViewOnceAsSeen controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * GET /api/messages/search/:id?q=query
 * Search messages within a specific conversation.
 */
const searchMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res.status(200).json([]);
        }

        const searchRegex = new RegExp(q.trim(), "i");

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ],
            messageType: "text",
            message: { $regex: searchRegex }
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('replyTo')
            .lean();

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in searchMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * GET /api/messages/search-all?q=query
 * Search messages across ALL conversations of the logged-in user.
 */
const searchAllMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res.status(200).json([]);
        }

        const searchRegex = new RegExp(q.trim(), "i");

        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ],
            messageType: "text",
            message: { $regex: searchRegex }
        })
            .sort({ createdAt: -1 })
            .limit(30)
            .populate('senderId', 'name username avatar')
            .populate('receiverId', 'name username avatar')
            .lean();

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in searchAllMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * GET /api/messages/unread-counts
 * Get unread message counts per sender for the logged-in user.
 */
const getUnreadCounts = async (req, res) => {
    try {
        const receiverId = req.user._id;

        const counts = await Message.aggregate([
            {
                $match: {
                    receiverId: receiverId,
                    status: { $ne: "seen" }
                }
            },
            {
                $group: {
                    _id: "$senderId",
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {};
        for (const item of counts) {
            result[item._id.toString()] = item.count;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getUnreadCounts controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    markMessagesAsSeen,
    uploadMedia,
    searchMessages,
    searchAllMessages,
    getUnreadCounts,
    markViewOnceAsSeen
};
