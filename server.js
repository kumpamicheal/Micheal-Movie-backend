require('dotenv').config();  // Load .env variables
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🎬 Movie server is running at http://localhost:${PORT}`);
    });
});  // <-- Closing brace and parenthesis for then()
