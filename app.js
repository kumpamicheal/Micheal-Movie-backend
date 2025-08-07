const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ✅ Allowed origins (Netlify + local dev)
const allowedOrigins = [
    'https://melodious-hotteok-6bc1a4.netlify.app',
    'http://localhost:3000'
];

console.log('🧪 Allowed Origins:', allowedOrigins);

// ✅ CORS configuration with safe logging
const corsOptions = {
    origin: function (origin, callback) {
        console.log('🌐 Incoming Origin:', origin);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn('⚠️ Blocked by CORS, but not crashing:', origin);
            callback(null, false); // ✅ Don't crash, just reject the request
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};


// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Enable CORS pre-flight for all routes
app.options(new RegExp('.*'), cors(corsOptions));


// ✅ Parse incoming JSON
// ✅ Increase request body size limit (important for large uploads like videos)
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));


// ✅ Serve static files (if using local file storage)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Import route files
const movieRoutes = require('./routes/movieRoutes');

const authRoutes = require('./routes/authRoutes');
const adminDeleteFile = require('./routes/adminDeleteFile');
const posterUploadRoute = require('./routes/posterUpload');

// ✅ Register API routes
app.use('/api/movies', movieRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminDeleteFile);
app.use('/api/posters', posterUploadRoute);

const listEndpoints = require('express-list-endpoints');

try {
    const endpoints = listEndpoints(app);
    console.log('✅ Registered Endpoints:\n', JSON.stringify(endpoints, null, 2));
} catch (err) {
    console.error('❌ Error listing endpoints:', err.message);
    console.error(err.stack);
}



// ✅ Root route
app.get('/', (req, res) => {
    res.send('🎬 Movie API is running. Use /api/movies or /api/slider-images.');
});

// ✅ Export app
module.exports = app;
