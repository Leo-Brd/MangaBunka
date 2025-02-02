const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email ou pseudo déjà utilisé.' });
        }

        const profilePic = req.file
            ? `/pp/${req.file.filename}`
            : 'https://i.pravatar.cc/150?u=default';

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            profilePic,
        });

        await user.save();
        res.status(201).json({ message: 'Utilisateur créé !' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
    }
};
