require('dotenv').config();  // Load .env variables
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🎬 Movie server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
}).catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
});
