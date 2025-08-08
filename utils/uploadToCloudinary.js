const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

// ✅ Configure Cloudinary (only once in your project)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a video buffer to Cloudinary
 * @param {Buffer} buffer - The file buffer (from multer.memoryStorage)
 * @param {string} folder - Cloudinary folder to upload to
 * @param {string} resource_type - 'video' or 'image'
 * @returns {Promise<object>} - Cloudinary upload result
 */
const uploadToCloudinary = (buffer, folder = 'movies', resource_type = 'video') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        // Convert buffer to readable stream
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

module.exports = uploadToCloudinary;
