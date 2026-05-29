const mongoose = require('mongoose');

/**
 * Connects to MongoDB with enhanced error handling and connection management.
 */
const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error('============================================================');
        console.error('❌ CRITICAL ERROR: MONGO_URI environment variable is missing!');
        console.error('Please configure MONGO_URI in your Render Environment settings.');
        console.error('============================================================');
        return;
    }

    if (process.env.NODE_ENV === 'production' && mongoUri.includes('localhost')) {
        console.warn('============================================================');
        console.warn('⚠️  WARNING: Using localhost MongoDB URI in production!');
        console.warn('Render cannot access your local database. Please use MongoDB Atlas.');
        console.warn('============================================================');
    }

    try {
        const conn = await mongoose.connect(mongoUri, {
            // Options can be added here if needed for specific environments
        });

        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
        
        // Listen for connection errors after initial connection
        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
        });

    } catch (error) {
        console.error('============================================================');
        console.error(`🔴 Error connecting to MongoDB: ${error.message}`);
        console.error('Check that your database user credentials and password are correct,');
        console.error('and that the password is URL-encoded if it contains special characters.');
        console.error('============================================================');
        // Do NOT call process.exit(1) so the server can boot and remain live for debugging.
    }
};

module.exports = connectDB;
