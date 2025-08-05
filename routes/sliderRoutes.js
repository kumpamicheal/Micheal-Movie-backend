const express = require('express');
const multer = require('multer');
const Slider = require('../models/Slider');
const adminAuth = require('../middlewares/authMiddleware');
const cloudinary = require('cloudinary').v2;


const router = express.Router();

// Set up Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Helper to upload to Cloudinary using a Promise
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'slider' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(fileBuffer); // Pipe the buffer into the stream
    });
};

// POST route to upload slider image
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
    try {
        // Upload image buffer to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);

        // Save to DB
        const newSliderItem = new Slider({
            imageUrl: result.secure_url,
            title: req.body.title || '',
            linkToMovie: req.body.linkToMovie || ''
        });

        await newSliderItem.save();

        res.status(201).json({ message: 'Slider item added', slider: newSliderItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload image and save slider item' });
    }
});

module.exports = router;
