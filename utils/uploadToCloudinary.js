// src/utils/uploadToCloudinary.js or ../utils/uploadToCloudinary.js
const cloudinary = require('../config/cloudinary');

// ✅ Ensure credentials are loaded (can be removed later if you prefer)
console.log('🔐 Cloudinary config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '✅ present' : '❌ missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ present' : '❌ missing',
});

const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
    const folderValue =
        typeof folder === 'string' ? folder : folder?.name || 'uploads';

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                folder: folderValue,
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary upload error:', error);
                    return reject(error);
                }

                console.log('✅ Cloudinary upload success:', result.secure_url);
                resolve(result);
            }
        );

        // ✅ End stream with buffer
        stream.end(fileBuffer);
    });
};

module.exports = uploadToCloudinary;
