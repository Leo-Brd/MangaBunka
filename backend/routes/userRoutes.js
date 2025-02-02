const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const compressImg = require('../middleware/compressImg');

const userCtrl = require('../controllers/userController');

// All the routes for the users
router.post('/signup', multer, compressImg, userCtrl.signup);

module.exports = router;