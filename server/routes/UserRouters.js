const express = require('express');
const userController = require('../controller/UserController');

const verifyToken = require('../middleware/VerifyToken.js');
const router = express.Router();

// routes
router.route('/').get(userController.initial);
router.route('/google').post(userController.googleLogin);
router.route('/register').post(userController.register);
router.route('/login').post(userController.login);

module.exports = router;
