const GoogleDrive = require('../googledrive.js');
const { User } = require('../models/UserModel');

exports.createProjectFolder = async (req, res, next) => {
	try {
		let id = req.user._id;
		if (!id) res.status(400).send('Id not found from jwt token.');

		let user = await User.findById(id);
		if (!user) return res.status(400).send('No user found.');

		let googleDrive = new GoogleDrive();

		let folderName = req.body.projectName;
		let parentFolderName = `PTM-${req.user._id}`;
		let ownerEmail = req.user.email;
		let companyEmail = req.body.companyEmail;

		let response = await googleDrive.createFolderAndMoveWithPermission(
			folderName,
			parentFolderName,
			ownerEmail,
			companyEmail
		);

		req.projectFolderId = response.result;

		return next();
	} catch (error) {
		console.error(error.message);
		return next(error.message);
	}
};

exports.createTaskFolder = async (req, res, next) => {
	try {
		let { projectFolderId, companyEmail } = req.savedProject;
		let folderName = req.body.taskName;

		let type = 'user';
		let role = 'owner';

		let googleDrive = new GoogleDrive();
		await googleDrive.init();

		let { result } = await googleDrive.createFolderAndMove(projectFolderId, folderName);
		await googleDrive.createPermission(result, type, role, companyEmail);

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
