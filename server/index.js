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
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || "http://localhost:8080",
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
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

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
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
