const express = require('express');
const router = express.Router();

// controller
const userController = require('../controller/UserController');

// middleware
const verifyToken = require('../middleware/VerifyToken.js');

// user routes
router.route('/').get(userController.initial);
router.route('/google').post(userController.googleLogin);
router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/:id').get(verifyToken, userController.find);
router.route('/update').put(verifyToken, userController.update);
router.put('/changePassword/:id', verifyToken, userController.changePassword);

module.exports = router;
