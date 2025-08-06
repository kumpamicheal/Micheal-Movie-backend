const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // ✅ Load env vars for Cloudinary & MongoDB

const app = express();

// ✅ Allow only specific origins (Netlify & localhost)
const allowedOrigins = [
    'https://melodious-hotteok-6bc1a4.netlify.app',
    'http://localhost:3000' // for development
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('❌ Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());

// ✅ Import routes
const movieRoutes = require('./routes/movieRoutes');
const sliderRoutes = require('./routes/sliderRoutes'); // Optional
const authRoutes = require('./routes/authRoutes');
const adminDeleteFile = require('./routes/adminDeleteFile');
const posterUploadRoute = require('./routes/posterUpload');

// ✅ Static file serving (if needed)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // only if storing locally

// ✅ API routes
app.use('/api/movies', movieRoutes);
app.use('/api/slider', sliderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminDeleteFile);
app.use('/api/posters', posterUploadRoute);

// ✅ Root route
app.get('/', (req, res) => {
    res.send('🎬 Movie API is running. Use /api/movies or /api/slider-images.');
});

module.exports = app;
