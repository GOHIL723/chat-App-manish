const express = require('express');
const multer = require('multer');
const {
    sendMessage,
    getMessages,
    markMessagesAsSeen,
    uploadMedia,
    searchMessages,
    searchAllMessages,
    getUnreadCounts,
    markViewOnceAsSeen
} = require('../controllers/messageController');
const { protectRoute } = require('../middleware/authMiddleware');

const router = express.Router();

// Disk storage — safely handles large video files without crashing memory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fs = require('fs');
        const dir = require('path').join(__dirname, '../uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
    fileFilter: (req, file, cb) => {
        const allowedPrefixes = [
            'image/',
            'audio/',
            'video/',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument',
            'application/zip',
            'application/x-zip',
            'text/',
        ];
        const allowed = allowedPrefixes.some(prefix => file.mimetype.startsWith(prefix));
        if (allowed) {
            cb(null, true);
        } else {
            cb(new Error(`File type not supported: ${file.mimetype}`), false);
        }
    }
});

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File too large. Maximum size is 50MB.' });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};

// Specific routes MUST come before parameterised ones
router.get("/unread-counts", protectRoute, getUnreadCounts);
router.get("/search-all", protectRoute, searchAllMessages);
router.get("/search/:id", protectRoute, searchMessages);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/seen/:id", protectRoute, markMessagesAsSeen);
router.post("/view-once/:messageId", protectRoute, markViewOnceAsSeen);
router.post("/upload", protectRoute, upload.single('file'), handleMulterError, uploadMedia);

module.exports = router;
