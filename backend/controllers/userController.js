const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            'b01b002589208cbf0e786ebee25865b3f80585843406099f3a1f3dc10a9fdbb2471a39b9e44ab5959aa7ab7dc66acc4d272071b9af5df3824a9cde19a2e721e7',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Connexion réussie !',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
};