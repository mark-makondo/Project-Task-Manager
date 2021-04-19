const express = require('express');
const router = express.Router();

// controllers
const userController = require('../controllers/UserController');

// middlewares
const verifyToken = require('../middlewares/VerifyToken.js');

// user routes
router.route('/google').post(userController.googleLogin);
router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/:id').get(verifyToken, userController.find);
router.route('/update').put(verifyToken, userController.update);
router.put('/changePassword/:id', verifyToken, userController.changePassword);
router.get('/notifications/:id', verifyToken, userController.getNotifications);

module.exports = router;
