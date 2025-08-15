const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const Movie = require('../models/Movie');
const adminAuth = require('../middlewares/authMiddleware');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer(); // memory storage

router.post('/upload-movie', adminAuth, upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {

    console.log("Cloudinary ENV:",
        process.env.CLOUDINARY_API_KEY,
        process.env.CLOUDINARY_API_SECRET,
        process.env.CLOUDINARY_CLOUD_NAME
    );

    try {
        const { title, genre } = req.body;
        if (!title || !genre) {
            return res.status(400).json({ message: "Title and Genre are required" });
        }

        const posterFile = req.files.poster[0];
        const videoFile = req.files.video[0];

        const uploadToCloudinary = (file, folder, resource_type) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder, resource_type },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        };

        const [posterUrl, videoUrl] = await Promise.all([
            uploadToCloudinary(posterFile, 'posters', 'image'),
            uploadToCloudinary(videoFile, 'movies', 'video')
        ]);

        const newMovie = await Movie.create({
            title,
            genre,
            posterUrl,
            videoUrl
        });

        res.json(newMovie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});

module.exports = router;
