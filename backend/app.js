const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// We create the express app and connect it to the database
const app = express();

mongoose.connect('mongodb+srv://LeoBrd:43LHxFbLd4X2f7oy@mon-vieux-grimoire.oltcf.mongodb.net//mangabunka?retryWrites=true&w=majority')
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




module.exports = app;