const express = require('express');
const router = express.Router();

// controllers
const projectController = require('../controllers/ProjectController');

// middlewares
const verifyToken = require('../middlewares/VerifyToken');
const googleDrive = require('../middlewares/GoogleDriveOperation');

// project routes
router.route('/findAll').get(verifyToken, projectController.findAllUserProjects);
router.route('/find/:pid').get(verifyToken, projectController.findOne);
router.route('/delete/:pid').delete(verifyToken, projectController.deleteProject);

// project members routes
router.route('/member/add').post(verifyToken, projectController.addMember);
router.route('/member/remove/:pid/:mid').delete(verifyToken, projectController.removeMember);
router.route('/member/findAll/:pid').get(projectController.getMembers);

// project tasks routes
router.route('/:pid/tasks').get(projectController.getTasks);
router.route('/task/remove/:pid/:tid').delete(verifyToken, projectController.removeTask);
router.route('/task/update').put(verifyToken, projectController.updateTask);

// task messages
router.route('/task/message/:tid').get(verifyToken, projectController.getMessages);
router.route('/task/message/add').post(verifyToken, projectController.addMessage);

// Routes with google drive middleware
router.route('/create').post(verifyToken, projectController.create, googleDrive.createProjectFolder);
router.route('/task/add').post(verifyToken, projectController.addTask, googleDrive.createTaskFolder);
router.route('/task/fileupload').post(verifyToken, projectController.fileUploadTask, googleDrive.createFile);

module.exports = router;
