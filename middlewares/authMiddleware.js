const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Invalid token format' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        req.user = user; // Attach user info to request
        next();
    });
};

module.exports = adminAuth;
