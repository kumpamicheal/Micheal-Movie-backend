
// controllers/movieController.js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const stream = require('stream');
const Movie = require('../models/Movie');

// ✅ Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Helper for Cloudinary signed uploads
const uploadToCloudinary = (fileBuffer, folder, resourceType) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: resourceType },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.Readable.from(fileBuffer).pipe(uploadStream);
    });
};


// ✅ Get all movies
exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (err) {
        console.error('Error in getAllMovies:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Get movie by ID
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (err) {
        console.error('Error in getMovieById:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Get movies with pagination (for Library.js)
exports.getPaginatedMovies = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 8;
     const skip = (page - 1) * limit;

      const movies = await Movie.find()
           .sort({ createdAt: -1 })
           .skip(skip)
           .limit(limit);

        const totalMovies = await Movie.countDocuments();
       const totalPages = Math.ceil(totalMovies / limit);

       res.status(200).json({
           movies,
           page,
            totalPages
        });
    } catch (err) {
       console.error('Error in getPaginatedMovies:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


// ✅ Search movies by title
exports.searchMovies = async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) {
            return res.status(400).json({ message: 'Title query is required' });
        }

        const movies = await Movie.find({
            title: { $regex: title, $options: 'i' }
        });

        res.status(200).json(movies);
    } catch (err) {
        console.error('Error in searchMovies:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Create movie (signed Cloudinary upload flow)
// ✅ Create movie (signed upload flow — no file upload here)
exports.createMovie = async (req, res) => {
    try {
        const { title, genre, posterUrl, posterPublicId, videoUrl, videoPublicId } = req.body;

        // Validate fields
        if (!title || !genre || !videoUrl) {
            return res.status(400).json({ message: 'Title, genre, and video URL are required' });
        }

        // Save to DB
        const movie = new Movie({
            title,
            genre,
            videoUrl,
            videoPublicId,
            posterUrl: posterUrl || null,
            posterPublicId: posterPublicId || null,
            status: 'approved',
        });

        const savedMovie = await movie.save();
        res.status(201).json(savedMovie);

    } catch (err) {
        console.error('❌ Error in createMovie:', err);
        res.status(500).json({
            message: 'Server error during movie creation',
            error: err.message,
        });
    }
};


// ✅ Update movie
exports.updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(updatedMovie);
    } catch (err) {
        console.error('Error in updateMovie:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Delete movie
exports.deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (err) {
        console.error('Error in deleteMovie:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
