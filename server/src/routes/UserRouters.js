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

// notifications
router.route('/:id/notifications').get(verifyToken, userController.getNotifications);
router.route('/notification/add').post(verifyToken, userController.addNotification);
router.route('/notification/update').put(verifyToken, userController.updateNotification);
router.route('/notification/remove/:nid').delete(verifyToken, userController.removeNotification);

module.exports = router;
