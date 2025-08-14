/*
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/posters/upload
router.post('/upload', upload.single('poster'), async (req, res) => {
    const { movieId } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No poster file uploaded' });
    }

    if (!movieId || !isValidObjectId(movieId)) {
        return res.status(400).json({ error: 'Invalid or missing movieId' });
    }

    try {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'posters' },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary error:', error);
                    return res.status(500).json({ error: 'Poster upload failed' });
                }

                const { secure_url: posterUrl, public_id: posterPublicId } = result;

                const updatedMovie = await Movie.findByIdAndUpdate(
                    movieId,
                    { posterUrl, posterPublicId },
                    { new: true }
                );

                if (!updatedMovie) {
                    return res.status(404).json({ error: 'Movie not found' });
                }

                res.status(200).json({
                    message: 'Poster uploaded and movie updated successfully',
                    posterUrl,
                    movie: updatedMovie
                });
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/posters/delete
router.delete('/delete', async (req, res) => {
    const { movieId, posterPublicId } = req.body;

    if (!movieId || !posterPublicId || !isValidObjectId(movieId)) {
        return res.status(400).json({ error: 'Missing or invalid movieId or posterPublicId' });
    }

    try {
        await cloudinary.uploader.destroy(posterPublicId);

        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            { $unset: { posterUrl: "", posterPublicId: "" } },
            { new: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.status(200).json({
            message: 'Poster deleted and movie updated successfully',
            movie: updatedMovie
        });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Failed to delete poster' });
    }
});

// GET /api/posters/movie/:movieId
router.get('/movie/:movieId', async (req, res) => {
    const { movieId } = req.params;

    if (!isValidObjectId(movieId)) {
        return res.status(400).json({ error: 'Invalid movieId' });
    }

    try {
        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        if (!movie.posterUrl || !movie.posterPublicId) {
            return res.status(404).json({ error: 'Poster not found for this movie' });
        }

        res.status(200).json({
            _id: movie._id,
            posterUrl: movie.posterUrl,
            posterPublicId: movie.posterPublicId
        });
    } catch (err) {
        console.error('Get poster error:', err);
        res.status(500).json({ error: 'Failed to fetch poster' });
    }
});

//module.exports = router;
*/