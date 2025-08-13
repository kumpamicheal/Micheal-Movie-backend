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
    const { folder, resource_type } = req.query;

    if (!folder || !resource_type) {
        return res.status(400).json({ message: 'Missing folder or resource_type' });
    }

    const timestamp = Math.round(Date.now() / 1000);

    // ✅ Only sign timestamp + folder
    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder, resource_type },
        process.env.CLOUDINARY_API_SECRET
    );

    res.json({
        timestamp,
        folder,
        resource_type, // still send to frontend
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    });
});

module.exports = router;
