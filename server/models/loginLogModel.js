const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: 'Unknown'
    },
    device: {
        type: String,
        default: 'Unknown'
    },
    suspicious: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('LoginLog', loginLogSchema);
