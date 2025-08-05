const Movie = require('../models/Movie');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

// Create a new movie
exports.createMovie = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const { title, genre } = req.body;
        if (!title || !genre) {
            return res.status(400).json({ message: 'Title and genre are required' });
        }

        const uploadResult = await uploadToCloudinary(req.file.buffer, {
            resource_type: 'video',
            folder: 'movies',
        });

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

// Get all movies
exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (err) {
        console.error('Error in getAllMovies:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// ✅ Updated: Search movies by title or genre (case-insensitive, partial match)
exports.searchMovies = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        const regex = new RegExp(query, 'i'); // case-insensitive

        const movies = await Movie.find({
            $or: [
                { title: regex },
                { genre: regex }
            ]
        }).limit(50); // optional: limit for performance

        res.status(200).json({ movies });
    } catch (err) {
        console.error('Error in searchMovies:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get movie by ID
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (err) {
        console.error('Error in getMovieById:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a movie by ID
exports.updateMovie = async (req, res) => {
    try {
        const { title, genre } = req.body;
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, genre },
            { new: true, runValidators: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json(updatedMovie);
    } catch (err) {
        console.error('Error in updateMovie:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a movie by ID
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (err) {
        console.error('Error in deleteMovie:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
