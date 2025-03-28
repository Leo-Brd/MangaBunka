const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
require('dotenv').config();

// We create the express app and connect it to the database
const app = express();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// We set the headers to avoid CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// We parse the incoming requests
app.use(bodyParser.json());

// We use the routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;