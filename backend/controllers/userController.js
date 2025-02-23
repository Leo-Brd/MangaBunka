const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Signup function
exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email ou pseudo déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: 'Utilisateur créé !' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
    }
};

// Login function
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
};

// Update the stats when a quizz is finished
exports.updateUserStats = async (req, res, next) => {
    try {
        const { userId, score } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const { gamesPlayed, averageScore, xp, level } = user.stats;

        const newGamesPlayed = gamesPlayed + 1;
        const newAverageScore = ((averageScore * gamesPlayed) + score) / newGamesPlayed;
        const newXp = xp + ( score * 10 );

        const newLevel = Math.floor(newXp / 200) + 1;

        user.stats.gamesPlayed = newGamesPlayed;
        user.stats.averageScore = newAverageScore;
        user.stats.xp = newXp;
        user.stats.level = newLevel;

        await user.save();
        res.status(200).json({ message: 'Stats modifiées !' });

    } catch (error) {
        console.error('Erreur lors de la mise à jour des statistiques utilisateur :', error.message);
        throw new Error('Impossible de mettre à jour les statistiques utilisateur');
    }
};