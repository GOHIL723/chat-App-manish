const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db.js');
const { app, server } = require('./sockets/socket.js');
const authRoutes = require('./routes/authRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const groupRoutes = require('./routes/groupRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
// Allowed origins list
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
].filter(Boolean); // Remove undefined values

console.log('🌐 CORS allowed origins:', allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`⚠️  CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Serve uploaded files statically with CORS headers (audio needs crossOrigin access)
app.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
    res.header("Access-Control-Expose-Headers", "Content-Length, Content-Range");
    next();
}, express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
        // Set correct MIME types for audio files
        if (filePath.endsWith('.webm')) res.set('Content-Type', 'audio/webm');
        if (filePath.endsWith('.ogg'))  res.set('Content-Type', 'audio/ogg');
        if (filePath.endsWith('.mp3'))  res.set('Content-Type', 'audio/mpeg');
        if (filePath.endsWith('.mp4'))  res.set('Content-Type', 'audio/mp4');
    }
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/admin", adminRoutes);

// Health check - Render ke liye zaroori
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API is running...',
        env: process.env.NODE_ENV,
        mongo: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
        time: new Date().toISOString()
    });
});

// Diagnostic endpoint - env check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        mongo_uri_set: !!process.env.MONGO_URI,
        jwt_secret_set: !!process.env.JWT_SECRET && process.env.JWT_SECRET !== 'your_super_secret_jwt_key_32_chars_long',
        frontend_url: process.env.FRONTEND_URL || 'NOT SET',
        node_env: process.env.NODE_ENV,
        mongo_state: require('mongoose').connection.readyState
        // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    });
});

// Start server
server.listen(PORT, () => {
    connectDB();
    console.log(`✨ Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Stopping server...');
    await require('mongoose').connection.close();
    process.exit(0);
});
