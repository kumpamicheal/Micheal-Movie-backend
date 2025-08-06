const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (fileBuffer, folder, resourceType = 'auto') => {
    const folderValue = typeof folder === 'string' ? folder : (folder?.name || 'uploads');

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                folder: folderValue,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};
