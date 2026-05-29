const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        default: ""
    },
    messageType: {
        type: String,
        enum: ["text", "image", "voice", "video", "file"],
        default: "text"
    },
    media: {
        type: String,
        default: ""
    },
    // Cloudinary public ID (for future deletion/management)
    mediaPublicId: {
        type: String,
        default: ""
    },
    // Original MIME type (e.g. "application/pdf", "video/mp4")
    mediaMimeType: {
        type: String,
        default: ""
    },
    // File size in bytes
    mediaSize: {
        type: Number,
        default: 0
    },
    // Voice message duration in seconds
    audioDuration: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["sent", "delivered", "seen"],
        default: "sent"
    },
    isViewOnce: {
        type: Boolean,
        default: false
    },
    viewOnceViewed: {
        type: Boolean,
        default: false
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
