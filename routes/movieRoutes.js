const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');
const upload = require('../middlewares/uploadMiddleware');
const adminAuth = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

// Fallback for unimplemented controller methods
const notImplemented = (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
};

// ✅ Safe handler wrapper
const safe = (fn) => (typeof fn === 'function' ? fn : notImplemented);

// ✅ Generate Cloudinary signature — moved above `/:id`
router.get('/sign', (req, res) => {
    const timestamp = Math.floor(Date.now() / 1000); // ✅ seconds, not ms
    const paramsToSign = `folder=movies&timestamp=${timestamp}`;
    const signature = crypto
        .createHash('sha1')
        .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
        .digest('hex');

    res.json({ timestamp, signature });
});

// GET all movies
router.get('/', safe(movieController.getAllMovies));

// SEARCH movies by title
router.get('/search', safe(movieController.searchMovies));

// GET movie by ID — must come **after** more specific routes
router.get('/:id', validateObjectId, safe(movieController.getMovieById));

// POST create movie — only accepts video; admin only
router.post(
    '/',
    adminAuth,
    upload.single('video'),
    safe(movieController.createMovie)
);

// PUT update movie — admin only
router.put(
    '/:id',
    adminAuth,
    validateObjectId,
    safe(movieController.updateMovie)
);

// DELETE movie — admin only
router.delete(
    '/:id',
    adminAuth,
    validateObjectId,
    safe(movieController.deleteMovie)
);

module.exports = router;
