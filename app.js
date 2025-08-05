const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // ✅ Load env vars for Cloudinary & MongoDB

const app = express();

// ✅ Import routes
const movieRoutes = require('./routes/movieRoutes');
const sliderRoutes = require('./routes/sliderRoutes'); // You might phase this out if replaced
const authRoutes = require('./routes/authRoutes');
const adminDeleteFile = require('./routes/adminDeleteFile');
const posterUploadRoute = require('./routes/posterUpload');


// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files (if needed)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // only if storing locally

// ✅ API routes
app.use('/api/movies', movieRoutes);
app.use('/api/slider', sliderRoutes); // Optional: Remove if not needed
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminDeleteFile);
app.use('/api/posters', posterUploadRoute);


// ✅ Root route
app.get('/', (req, res) => {
    res.send('🎬 Movie API is running. Use /api/movies or /api/slider-images.');
});

module.exports = app;
