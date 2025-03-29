const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userController');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

// All the routes for the users
router.get('/getTopUsersByXP', userCtrl.getTopUsersByXP);
router.put('/updateStats/:id', auth, userCtrl.updateUserStats);
router.put('/updateProfilePic/:id', auth, multer, userCtrl.updateProfilePic);
router.put('/updateUsername/:id', auth, userCtrl.updateUsername);

module.exports = router;