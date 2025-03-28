const User = require('../models/userModel');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();


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

// To change the profile pic
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

// To change the username
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