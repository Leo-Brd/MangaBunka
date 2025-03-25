const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Token manquant ou invalide." });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.auth = { userId: decodedToken.userId };
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Token invalide." });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expiré." });
        }
        res.status(401).json({ message: "Authentification échouée." });
    }
};