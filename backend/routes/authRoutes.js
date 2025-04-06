const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authController');

// All the routes for the users
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.post('/google', authCtrl.googleLogin)

module.exports = router;