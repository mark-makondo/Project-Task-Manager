const GoogleDrive = require('../googledrive.js');
const { Project } = require('../models/ProjectModel');

let googleDrive = new GoogleDrive();

/**
 * When a project was saved to the database this wil create a folder
 * in the google drive and saved the projectFolderId to the current project.Then
 * save the task folder id to the database.
 */
exports.createProjectFolder = async (req, res, next) => {
	try {
		let { _id, email } = req.user;
		let { projectName, companyEmail } = req.savedProject;

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

/**
 * When a task was succesfuly created inside of a project then this will
 * create a task folder and the parent will be the folder of the current project. Then
 * save the task folder id to the database.
 */
exports.createTaskFolder = async (req, res, next) => {
	try {
		await googleDrive.init();

		let { latestDoc, pushedTask } = req.latestTask;

		let _pid = pushedTask._id;
		let projectFolderId = pushedTask.projectFolderId;
		let _tid = latestDoc._id;
		let folderName = latestDoc.taskName;

		let { result } = await googleDrive.createFolderAndMove(projectFolderId, folderName);
		let taskFolderId = result.data.id;

		await googleDrive.createPermission(taskFolderId);

		let project = await Project.findById(_pid);
		let subdoc = project.tasks.id(_tid);

		subdoc['taskFolderId'] = taskFolderId;
		await project.save();

		return next();
	} catch (error) {
		console.error(error.message);
		return next(error.message);
	}
};

/**
 * When uploading of images or document is a success then this middleware will run
 * and create a spefic file to the google drive that corresponds to the uploaded file
 * and put it inside of the current task folder. The result will also be saved
 * to the uploaded documents in the project collection.
 */
exports.createFile = async (req, res, next) => {
	try {
		await googleDrive.init();

		let { _tid, _pid } = req.body;
		let { originalname, mimetype, filename, path } = req.file;

		let project = await Project.findById(_pid);
		let subdoc = project.tasks.id(_tid);

		let { fileId, publicUrl } = await googleDrive.createFileAndMove(
			subdoc.taskFolderId,
			originalname,
			path,
			mimetype
		);
		await googleDrive.createPermission(fileId);

		let formatToSendToUploadedFiles = {
			googleDownloadLink: publicUrl.webContentLink,
			googleViewLink: publicUrl.webViewLink,
			fileName: originalname,
		};

		if (req.isImage) {
			subdoc.fileUpload.push(formatToSendToUploadedFiles);
			await project.save();

			res.status(200).json({ isImage: true, url: filename, publicUrl });
			return next();
		}

		subdoc.fileUpload.push(formatToSendToUploadedFiles);
		await project.save();

		res.status(200).json({ isImage: false, originalname, publicUrl });
		return next();
	} catch (error) {
		console.error(error.message);
		return next(error.message);
	}
};
