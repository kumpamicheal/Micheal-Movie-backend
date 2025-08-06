const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // ✅ Load env vars (Cloudinary, MongoDB, etc.)

const app = express();

// ✅ CORS config: allow Netlify + local dev
const allowedOrigins = [
    'https://melodious-hotteok-6bc1a4.netlify.app',
    'http://localhost:3000'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('❌ Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

// ✅ Use CORS middleware
app.use(cors(corsOptions));

// ✅ Preflight support for all routes
app.options('*', cors(corsOptions));

// ✅ Body parser middleware
app.use(express.json());

// ✅ Static files (optional - only if storing locally)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API route imports
const movieRoutes = require('./routes/movieRoutes');
const sliderRoutes = require('./routes/sliderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminDeleteFile = require('./routes/adminDeleteFile');
const posterUploadRoute = require('./routes/posterUpload');

// ✅ API routes
app.use('/api/movies', movieRoutes);
app.use('/api/slider', sliderRoutes); // optional
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminDeleteFile);
app.use('/api/posters', posterUploadRoute);

// ✅ Root route
app.get('/', (req, res) => {
    res.send('🎬 Movie API is running. Use /api/movies or /api/slider-images.');
});

module.exports = app;
