const cloudinary = require('../config/cloudinary');
const crypto = require('crypto');

const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        const timestamp = Math.floor(Date.now() / 1000);

        const folderValue = typeof folder === 'string' ? folder : folder?.name || 'uploads';

        const paramsToSign = {
            folder: folderValue,
            timestamp,
        };

        // Generate the signature
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                folder: folderValue,
                timestamp,
                signature,
                api_key: process.env.CLOUDINARY_API_KEY, // Required
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

        // Stream the video buffer
        stream.end(fileBuffer);
    });
};

module.exports = uploadToCloudinary;
