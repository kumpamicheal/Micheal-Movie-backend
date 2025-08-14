const express = require('express');
const router = express.Router();
const { v2: cloudinary } = require('cloudinary');
const adminAuth = require('../middlewares/authMiddleware');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * GET /cloudinary/sign
 * Query params: folder (required), resource_type ('image' or 'video', default 'image')
 */
router.get('/sign', adminAuth, (req, res) => {
    const { folder, resource_type = 'image' } = req.query;

    if (!folder) {
        return res.status(400).json({ message: 'Missing folder' });
    }

    const timestamp = Math.floor(Date.now() / 1000);

    // Generate signature using Cloudinary helper
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
