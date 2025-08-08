const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const upload = require('../middlewares/uploadMiddleware');
const adminAuth = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const notImplemented = (req, res) => {
    res.status(501).json({ message: 'Not implemented' });
};

const safe = (fn) => (typeof fn === 'function' ? fn : notImplemented);

// ✅ Cloudinary Signature Endpoint — with Debug Logs
router.get('/sign', (req, res) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=movies&timestamp=${timestamp}`;
    const fullString = paramsToSign + process.env.CLOUDINARY_API_SECRET;
    const signature = crypto.createHash('sha1').update(fullString).digest('hex');

    // 🔍 Debug Logs
    console.log('🔐 Signature requested');
    console.log('📦 Params to sign:', paramsToSign);
    console.log('🔑 Full string to hash:', fullString);
    console.log('✅ Generated signature:', signature);
    console.log('🕒 Timestamp:', timestamp);

    res.json({ timestamp, signature });
});

// CRUD Routes
router.get('/', safe(movieController.getAllMovies));
router.get('/search', safe(movieController.searchMovies));
router.get('/:id', validateObjectId, safe(movieController.getMovieById));

router.post(
    '/',
    adminAuth,
    upload.single('video'),
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
