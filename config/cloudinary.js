const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// ✅ Load .env variables
dotenv.config();

// ✅ Log to verify env variables are loaded (optional, remove in production)
console.log('🔑 Cloudinary ENV:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Loaded' : '❌ MISSING!',
});

// ✅ Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

