const express = require('express');
const router = express.Router();
const { v2: cloudinary } = require('cloudinary');
const adminAuth = require('../middlewares/authMiddleware');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/sign', adminAuth, (req, res) => {
    const { folder } = req.query;

    if (!folder) {
        return res.status(400).json({ message: 'Missing folder' });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const resource_type = "video"; // ✅ always fixed here

    // ✅ Sign with timestamp, folder, and resource_type
    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder, resource_type },
        process.env.CLOUDINARY_API_SECRET
    );

    res.json({
        timestamp,
        folder,
        resource_type,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    });
});

module.exports = router;
