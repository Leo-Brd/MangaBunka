const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
require('dotenv').config();

// We create the express app and connect it to the database
const app = express();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// We parse the incoming requests
app.use(bodyParser.json());

// We use the routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/images', express.static(path.join(__dirname, 'images')));

module.exports = app;