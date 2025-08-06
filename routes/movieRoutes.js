const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');
const upload = require('../middlewares/uploadMiddleware');
const adminAuth = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

// Fallback for unimplemented controller methods
const notImplemented = (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
};

// GET all movies
router.get(
    '/',
    typeof movieController.getAllMovies === 'function' ? movieController.getAllMovies : notImplemented
);

// SEARCH movies by title
router.get(
    '/search',
    typeof movieController.searchMovies === 'function' ? movieController.searchMovies : notImplemented
);

// GET movie by ID
router.get(
    '/:id',
    validateObjectId,
    typeof movieController.getMovieById === 'function' ? movieController.getMovieById : notImplemented
);

// POST create movie — only accepts video; admin only
router.post(
    '/',
    adminAuth,
    upload.single('video'),
    typeof movieController.createMovie === 'function' ? movieController.createMovie : notImplemented
);

// PUT update movie — admin only
router.put(
    '/:id',
    adminAuth,
    validateObjectId,
    typeof movieController.updateMovie === 'function' ? movieController.updateMovie : notImplemented
);

// DELETE movie — admin only
router.delete(
    '/:id',
    adminAuth,
    validateObjectId,
    typeof movieController.deleteMovie === 'function' ? movieController.deleteMovie : notImplemented
);

module.exports = router;
