// middlewares/uploadMiddleware.js

const multer = require("multer");

// Store files in memory so we can upload to Firebase
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
