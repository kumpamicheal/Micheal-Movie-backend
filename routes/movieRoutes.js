const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const upload = require('../middlewares/uploadMiddleware');
const adminAuth = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

const notImplemented = (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
};

const safe = (fn) => (typeof fn === 'function' ? fn : notImplemented);

// ✅ CRUD Routes Only (No /sign route)
router.get('/', safe(movieController.getAllMovies));
router.get('/search', safe(movieController.searchMovies));

// ✅ New paginated route for Library.js
router.get('/paginated', safe(movieController.getPaginatedMovies));

// ✅ New signed upload route for frontend — MUST be before '/:id'
router.get('/upload-signature', movieController.getUploadSignature);

// ✅ Get movie by ID
router.get('/:id', validateObjectId, safe(movieController.getMovieById));

//router.post(
//    '/',
//    adminAuth,
//    upload.single('video'),
//    safe(movieController.createMovie)
//);

router.post(
    '/',
    adminAuth,
    safe(movieController.createMovie)
);

router.put(
    '/:id',
    adminAuth,
    validateObjectId,
    safe(movieController.updateMovie)
);

router.delete(
    '/:id',
    adminAuth,
    validateObjectId,
    safe(movieController.deleteMovie)
);

module.exports = router;
