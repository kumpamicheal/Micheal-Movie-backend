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

        // ✅ DEBUG LOGS — temporary, remove after testing
        console.log('🔐 Signing upload request...');
        console.log('📁 folder:', folderValue);
        console.log('🕒 timestamp:', timestamp);
        console.log('📦 Params to sign:', paramsToSign);
        console.log('🔑 API_SECRET (first 5 chars):', process.env.CLOUDINARY_API_SECRET?.slice(0, 5) + '***');

        // ✅ Generate signature
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        console.log('🧾 Generated Signature:', signature);

        // ✅ Start upload
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                folder: folderValue,
                timestamp,
                signature,
                api_key: process.env.CLOUDINARY_API_KEY,
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

        // ✅ Pipe file buffer into upload stream
        stream.end(fileBuffer);
    });
};

module.exports = uploadToCloudinary;
