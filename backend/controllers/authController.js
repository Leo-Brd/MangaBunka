const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// Google Login function
exports.googleLogin = async (req, res) => {
    try {
        // 1. Vérification du token Google (obligatoire en production)
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential, // Le token JWT brut
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { email, name, picture, sub: googleId } = ticket.getPayload();

        // 2. Recherche/Création de l'utilisateur
        let user = await User.findOneAndUpdate(
            { $or: [{ email }, { googleId }] },
            {
                $setOnInsert: { // Seulement à la création
                    username: name || email.split('@')[0],
                    email,
                    profilePic: picture || '',
                    googleId,
                    authMethod: 'google',
                    isVerified: true,
                    stats: { gamesPlayed: 0, averageScore: 0, level: 1, xp: 0 }
                },
                $set: { // Mise à jour dans tous les cas
                    lastLogin: new Date()
                }
            },
            { 
                upsert: true,
                new: true,
                setDefaultsOnInsert: true 
            }
        );

        // 3. Génération du JWT
        const token = jwt.sign(
            { userId: user._id, authMethod: 'google' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 4. Réponse avec cookie HTTPOnly (plus sécurisé)
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24h
        }).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic
            }
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(401).json({ 
            success: false,
            message: 'Échec de l\'authentification Google'
        });
    }
};