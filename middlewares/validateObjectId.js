// middlewares/validateObjectId.js
const mongoose = require('mongoose');

function validateObjectId(req, res, next) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid movie ID format' });
    }
    next();
}

module.exports = validateObjectId;
