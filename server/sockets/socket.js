const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            // Allow Vercel/Netlify dynamic subdomains, localhosts, or explicit frontend URL
            if (!origin || origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app') || origin.includes('localhost') || origin === process.env.FRONTEND_URL) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = {}; // {userId: socketId}

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Typing indicators
    socket.on('typing', ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('typing', { senderId: userId });
        }
    });

    socket.on('stopTyping', ({ receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('stopTyping', { senderId: userId });
        }
    });

    // When user marks messages as seen, emit back to same user's socket (their other tabs/sidebar)
    socket.on('markedSeen', ({ senderId }) => {
        // Broadcast back to the SAME logged-in user so their sidebar updates unread count
        const mySocketId = userSocketMap[userId];
        if (mySocketId) {
            io.to(mySocketId).emit('markedSeen', { senderId });
        }
    });

    // ── Group Chat Socket Events ──────────────────────────
    // Join a socket room for a group
    socket.on('joinGroup', ({ groupId }) => {
        socket.join(`group_${groupId}`);
    });

    // Leave a socket room for a group
    socket.on('leaveGroup', ({ groupId }) => {
        socket.leave(`group_${groupId}`);
    });

    // Group typing indicators
    socket.on('groupTyping', ({ groupId }) => {
        socket.to(`group_${groupId}`).emit('groupTyping', { groupId, senderId: userId });
    });

    socket.on('groupStopTyping', ({ groupId }) => {
        socket.to(`group_${groupId}`).emit('groupStopTyping', { groupId, senderId: userId });
    });

    // ── WebRTC Voice Call Signaling ──────────────────────────
    socket.on('callUser', ({ userToCall, signalData, from, name, avatar }) => {
        const receiverSocketId = getReceiverSocketId(userToCall);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('incomingCall', { signal: signalData, from, name, avatar });
        }
    });

    socket.on('answerCall', ({ to, signal }) => {
        const callerSocketId = getReceiverSocketId(to);
        if (callerSocketId) {
            io.to(callerSocketId).emit('callAccepted', signal);
        }
    });

    socket.on('iceCandidate', ({ to, candidate }) => {
        const targetSocketId = getReceiverSocketId(to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('iceCandidate', candidate);
        }
    });

    socket.on('endCall', ({ to }) => {
        const targetSocketId = getReceiverSocketId(to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('endCall');
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { app, io, server, getReceiverSocketId };
