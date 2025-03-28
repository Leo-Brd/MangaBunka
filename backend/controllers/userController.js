const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
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
        const { score } = req.body;
        const userId = req.params.id;

        if (!score || isNaN(score)) {
            return res.status(400).json({ message: 'Score invalide ou manquant.' });
        }
        
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
        res.status(200).json({ 
            message: 'Stats modifiées !',
            stats: user.stats
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour des statistiques utilisateur :', error.message);
        throw new Error('Impossible de mettre à jour les statistiques utilisateur');
    }
};


exports.updateProfilePic = async (req, res, next) => {
    let oldImagePath = null;
    
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier fourni." });
        }

        const userId = req.auth.userId;
        const profilePicPath = '/images/' + req.file.filename;

        const currentUser = await User.findById(userId);
        if (currentUser?.profilePic && !currentUser.profilePic.includes('defaultPP')) {
            oldImagePath = path.join(__dirname, '..', currentUser.profilePic);
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { profilePic: profilePicPath },
            { new: true }
        );

        if (!user) {
            await fs.unlink(path.join(__dirname, '..', 'images', req.file.filename))
                .catch(err => console.error("Erreur suppression nouvelle image:", err));
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        if (oldImagePath) {
            try {
                await fs.access(oldImagePath); 
                
                await fs.unlink(oldImagePath); 
                console.log('✅ Ancienne image supprimée:', path.basename(oldImagePath));
            } catch (err) {
                console.error('❌ Échec suppression:', {
                    fichier: path.basename(oldImagePath),
                    erreur: err.message
                });
            }
        }

        res.status(200).json({
            message: "Photo de profil mise à jour",
            profilePic: profilePicPath
        });

    } catch (error) {
        console.error("Erreur globale:", error);
        
        // Nettoyage en cas d'erreur
        if (req.file) {
            await fs.unlink(path.join(__dirname, '..', 'images', req.file.filename))
                .catch(err => console.error("Erreur nettoyage:", err));
        }

        res.status(500).json({ 
            message: "Erreur serveur",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.updateUsername = async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Veuillez fournir un pseudo." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.auth.userId,
            { username },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        res.status(200).json({
            message: "Pseudo mis à jour avec succès.",
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                profilePic: updatedUser.profilePic,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du pseudo :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour du pseudo." });
    }
};