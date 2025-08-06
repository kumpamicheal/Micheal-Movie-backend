const Movie = require('../models/Movie');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

exports.createMovie = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const { title, genre } = req.body;
        if (!title || !genre) {
            return res.status(400).json({ message: 'Title and genre are required' });
        }

        // Corrected call to uploadToCloudinary: pass folder and resourceType separately
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'movies', 'video');

        const movie = new Movie({
            title,
            genre,
            videoUrl: uploadResult.secure_url,
            videoPublicId: uploadResult.public_id,
            status: 'approved',
        });

        await movie.save();

        res.status(201).json({
            message: 'Movie uploaded and saved successfully',
            movie,
        });
    } catch (err) {
        console.error('Error in createMovie:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
