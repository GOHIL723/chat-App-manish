const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // If missing, it's a system auto-generated report
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    isSystemGenerated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
