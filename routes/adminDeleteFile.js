// adminDeleteFile.js

const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const authenticateToken = require('../middlewares/authMiddleware');
// adjust path as necessary

router.post('/delete-file', authenticateToken, async (req, res) => {
    const { public_id } = req.body;

    if (!public_id) {
        return res.status(400).json({ success: false, message: 'public_id is required' });
    }

    try {
        // Determine resource type by simple check (adjust if needed)
        const resource_type = public_id.includes('video') ? 'video' : 'image';

        const result = await cloudinary.uploader.destroy(public_id, { resource_type });

        if (result.result === 'ok') {
            return res.json({ success: true, message: 'File deleted successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Deletion failed', result });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
