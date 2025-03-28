const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authController');

// All the routes for the users
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

module.exports = router;