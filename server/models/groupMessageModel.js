const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    senderId: {
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
        enum: ["text", "image", "voice", "video", "file", "system"],
        default: "text"
    },
    media: {
        type: String,
        default: ""
    },
    mediaPublicId: {
        type: String,
        default: ""
    },
    mediaMimeType: {
        type: String,
        default: ""
    },
    mediaSize: {
        type: Number,
        default: 0
    },
    audioDuration: {
        type: Number,
        default: 0
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupMessage',
        default: null
    }
}, { timestamps: true });

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

module.exports = GroupMessage;
