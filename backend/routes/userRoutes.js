const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userController');

// All the routes for the users
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/updateStats', userCtrl.updateUserStats);

module.exports = router;