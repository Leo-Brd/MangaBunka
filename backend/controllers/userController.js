const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// ALL THE FUNCTIONS FOR THE USERS

// We create a new user with a hashed password
exports.signup = async (req, res, next) => {
    const { username, email, password, profilePic } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({ message: 'Email ou pseudo déjà utilisé.' });
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                username,
                email,
                password: hash,
                profilePic: profilePic || undefined,
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};