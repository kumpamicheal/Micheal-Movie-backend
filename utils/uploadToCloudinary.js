const stream = cloudinary.uploader.upload_stream(
    {
        resource_type: resourceType,
        folder: folderValue,
        // ❌ REMOVE timestamp, signature, api_key
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
