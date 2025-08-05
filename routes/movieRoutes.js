const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');
const upload = require('../middlewares/uploadMiddleware');
const adminAuth = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');



// ✅ Safe fallback for unimplemented routes
const notImplemented = (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
};

// ✅ GET all movies
if (typeof movieController.getAllMovies === 'function') {
    router.get('/', movieController.getAllMovies);
}

// ✅ SEARCH movies by title
if (typeof movieController.searchMovies === 'function') {
    router.get('/search', movieController.searchMovies);
}

// ✅ GET movie by ID
router.get('/:id', validateObjectId, movieController.getMovieById || notImplemented);

// ✅ POST create movie — only accepts video
router.post(
    '/',
    adminAuth,
    upload.single('video'),
    movieController.createMovie
);

// ✅ PUT update movie (fallback to notImplemented if not defined)
router.put(
    '/:id',
    adminAuth,
    validateObjectId,
    movieController.updateMovie || notImplemented
);

// ✅ DELETE movie (fallback to notImplemented if not defined)
router.delete(
    '/:id',
    adminAuth,
    validateObjectId,
    movieController.deleteMovie || notImplemented
);

module.exports = router;
