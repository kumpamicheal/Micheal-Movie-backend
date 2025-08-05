const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        enum: ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Other']
    },
    videoUrl: {
        type: String,
        required: true
    },
    videoPublicId: {
        type: String,
        required: false
    },
    posterUrl: {
        type: String,
        required: false  // Optional since some movies may not have posters yet
    },
    posterPublicId: {
        type: String,
        required: false  // Cloudinary public ID for deleting poster from cloud
    },
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'approved'
    }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
