// testUpload.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Hardcoded credentials for testing
cloudinary.config({
    cloud_name: 'dutoofaax',
    api_key: '768113179427783',
    api_secret: 'tyRbz2DJHB-DG5NYQ4Q67Xktkdc'
});

// Path to your test image
const imagePath = path.join(__dirname, 'poster.jpg');

const uploadTest = async () => {
    // Check if file exists first
    if (!fs.existsSync(imagePath)) {
        console.error("File not found:", imagePath);
        return;
    }

    const stream = cloudinary.uploader.upload_stream({ folder: 'test' }, (error, result) => {
        if (error) {
            console.error("Cloudinary upload error:", error);
        } else {
            console.log("Upload succeeded:", result);
        }
    });

    fs.createReadStream(imagePath).pipe(stream);
};

// Run the test
uploadTest();
