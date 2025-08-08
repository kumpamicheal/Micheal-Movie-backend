const Movie = require('../models/Movie');
const uploadUnsigned = require('../utils/uploadUnsigned'); // ⬅️ changed import

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
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json(movie);
    } catch (err) {
        console.error('Error in getMovieById:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Search movies by title
exports.searchMovies = async (req, res) => {
    try {
        const { title } = req.query;
        if (!title) return res.status(400).json({ message: 'Title query is required' });

        const movies = await Movie.find({
            title: { $regex: title, $options: 'i' }
        });

        res.status(200).json(movies);
    } catch (err) {
        console.error('Error in searchMovies:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Create movie
exports.createMovie = async (req, res) => {
    try {
        // 1. Validate video file exists
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const { title, genre } = req.body;

        // 2. Validate required fields
        if (!title || !genre) {
            return res.status(400).json({ message: 'Title and genre are required' });
        }

        // 3. Upload video to Cloudinary (unsigned)
        const uploadResult = await uploadUnsigned(req.file.buffer);

        // 4. Create a new Movie document
        const movie = new Movie({
            title,
            genre,
            videoUrl: uploadResult.secure_url,
            videoPublicId: uploadResult.public_id,
            status: 'approved', // or 'pending' if you plan moderation
        });

        // 5. Save to DB and return saved movie
        const savedMovie = await movie.save();
        res.status(201).json(savedMovie);

    } catch (err) {
        console.error('❌ Error in createMovie:', err);
        res.status(500).json({
            message: 'Server error during movie upload',
            error: err.message,
        });
    }
};

// ✅ Update movie
exports.updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
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
        if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (err) {
        console.error('Error in deleteMovie:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
