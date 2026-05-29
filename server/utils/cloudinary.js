const cloudinary = require('cloudinary').v2;

// Validate required env vars at startup
const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
required.forEach(key => {
    if (!process.env[key] || process.env[key].startsWith('your_')) {
        console.warn(`⚠️  Cloudinary: Missing or placeholder env var: ${key}`);
    }
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Always use HTTPS URLs
});

// Folder mapping by media type
const FOLDERS = {
    image: 'zenith_chat/images',
    video: 'zenith_chat/videos',
    voice: 'zenith_chat/voices',
    file:  'zenith_chat/files',
};

module.exports = { cloudinary, FOLDERS };
