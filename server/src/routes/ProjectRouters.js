const express = require('express');
const router = express.Router();

// controllers
const projectController = require('../controllers/ProjectController');

// middlewares
const verifyToken = require('../middlewares/VerifyToken.js');

// project routes
router.route('/create').post(verifyToken, projectController.create);
router.route('/findAll').get(verifyToken, projectController.findAllUserProjects);
router.route('/find/:pid').get(verifyToken, projectController.findOne);
router.route('/delete/:pid').delete(verifyToken, projectController.deleteProject);

// project members routes
router.route('/member/add').post(verifyToken, projectController.addMember);
router.route('/member/remove').delete(verifyToken, projectController.removeMember);

// project tasks routes
router.route('/task/add').post(verifyToken, projectController.addTask);
router.route('/task/remove').delete(verifyToken, projectController.removeTask);
router.route('/task/update').put(verifyToken, projectController.updateTask);

module.exports = router;
