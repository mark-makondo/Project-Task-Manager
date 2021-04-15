const GoogleDrive = require('../googledrive.js');
const { User } = require('../models/UserModel');
const { Project } = require('../models/ProjectModel');

exports.createProjectFolder = async (req, res, next) => {
	try {
		let { _id, email } = req.user;
		let { projectName, companyEmail } = req.savedProject;

		let googleDrive = new GoogleDrive();

		let folderName = projectName;
		let parentFolderName = `PTM-${_id}`;
		let ownerEmail = email;

		let response = await googleDrive.createFolderAndMoveWithPermission(
			folderName,
			parentFolderName,
			ownerEmail,
			companyEmail
		);

		let projectFolderId = response.result;

		let findProject = await Project.findByIdAndUpdate(
			req.savedProject._id,
			{ projectFolderId },
			{ useFindAndModify: false, new: true }
		);

		findProject.save();

		return next();
	} catch (error) {
		console.error(error.message);
		return next(error.message);
	}
};

exports.createTaskFolder = async (req, res, next) => {
	try {
		// let { _pid, companyEmail } = req.savedProject;

		// // let { pid, companyEmail } = req.addedTask;
		// let folderName = req.body.taskName;

		// let type = 'user';
		// let role = 'owner';

		// let googleDrive = new GoogleDrive();
		// await googleDrive.init();

		// let { result } = await googleDrive.createFolderAndMove(_pid, folderName);
		// await googleDrive.createPermission(result, type, role, companyEmail);

		// // console.log(result);
		// res.status(200).send({ message: 'Added task successfully.', result: req.savedProject });

		return next();
	} catch (error) {
		console.error(error.message);
		return next(error.message);
	}
};

exports.deleteProjectFolder = async (req, res, next) => {
	try {
		return next();
	} catch (error) {
		console.error(error.message);
		return next(error.message);
	}
};

exports.deleteTaskFolder = async (req, res, next) => {
	try {
		return next();
	} catch (error) {
		console.error(error.message);
		return next(error.message);
	}
};

exports.createFile = async (req, res, next) => {
	try {
		return next();
	} catch (error) {
		console.error(error.message);
		return next(error.message);
	}
};
