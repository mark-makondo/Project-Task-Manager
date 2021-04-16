const { promisify } = require('util');
const upload = require('../multer');
const fs = require('fs');

// models
const { Project } = require('../models/ProjectModel');
const { User } = require('../models/UserModel');
const { Message } = require('../models/MessageModel');

//#region Query for projects : CREATE, FIND ALL OR ONE, DELETE.

exports.create = async (req, res, next) => {
	try {
		let id = req.user._id;
		if (!id) res.status(400).send('Id not found from jwt token.');

		let user = await User.findById(id);
		if (!user) return res.status(400).send('No user found.');

		let projectName = req.body.projectName;
		if (!projectName) return res.status(400).send('Project name is required.');

		let project = new Project({
			projectName: projectName,
			companyEmail: req.body.companyEmail,
			owner: user._id,
			projectFolderId: '',
		});

		let savedProject = await project.save();

		user.projects.push(savedProject);

		await user.save();

		res.status(200).send(savedProject);

		req.savedProject = savedProject;

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

exports.findAllUserProjects = async (req, res, next) => {
	try {
		let id = req.user._id;
		if (!id) res.status(400).send('Id not found from jwt token.');

		let user = await User.findById(id);
		if (!user) return res.status(400).send('No user found.');

		let projects = await user.execPopulate({
			path: 'projects',
			model: Project,
			populate: { path: 'members._id', model: User },
			populate: { path: 'owner', model: User },
			populate: { path: 'tasks.assigned', model: User },
		});

		res.status(200).send(projects);

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

/**
 * Get one project data from our projects collection.
 */
exports.findOne = async (req, res, next) => {
	try {
		let user = req.user;

		let pid = req.params.pid;
		if (!pid) res.status(400).send('Parameter id not found.');

		let findProject = await Project.findById(pid);
		if (!findProject) res.status(400).send('Project not found.');

		let project = await findProject
			.populate('owner')
			.populate('members._id')
			.populate({
				path: 'tasks.assigned',
				select: 'name email avatar',
			})
			.execPopulate();

		res.status(200).send({ project, user });

		return next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

exports.deleteProject = async (req, res, next) => {
	try {
		let pid = req.params.pid;
		if (!pid) return res.status(400).send('pid not found from path parameters.');

		let project = await Project.findOneAndDelete({ _id: pid }, { useFindAndModify: false });
		if (!project) return res.send.status(400).send('Project removal failed.');

		let membersId = project.members.map((id) => id._id);
		let ownerId = project.owner;

		// get all the matching id using $in and pull out the project from the users collection.
		await User.updateMany(
			{ _id: { $in: [...membersId, ownerId] } },
			{ $pull: { projects: project._id } },
			{
				multi: true,
			}
		);

		res.status(200).send({ message: 'Project and associated refs removed successfuly.' });

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

//#endregion

//#region Query for project members: ADD, REMOVE.

exports.addMember = async (req, res, next) => {
	try {
		let id = req.body._id;
		if (!id) return res.status(400).send('id not found.');

		let pid = req.body._pid;
		if (!pid) return res.status(400).send('pid not found.');

		let user = await User.findById(id);
		if (!user) return res.status(400).send('User not found.');

		let project = await Project.findById(pid);
		if (!project) return res.status(400).send('Project not found.');

		let findFilter = { _id: pid, 'members._id': user._id };
		let findMember = await Project.find(findFilter);
		if (findMember.length !== 0) return res.status(400).send('User is already a member.');

		project.members.push(user);
		user.projects.push(project);

		await user.save();
		await project.save();

		res.status(200).send({
			message: `${user.name} was added on project ${project.projectName}`,
			result: { user: user },
		});

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

exports.removeMember = async (req, res, next) => {
	try {
		let mid = req.body._mid;
		if (!mid) return res.status(400).send('mid path not found from body.');

		let pid = req.body._pid;
		if (!pid) return res.status(400).send('pid not found not found from body.');

		// remove the specified member's id from our project collection.
		await Project.updateOne(
			{ _id: pid },
			{
				$pull: { members: { _id: mid } },
			}
		);

		// remove the specified project's id from our user collection.
		await User.updateOne({ _id: mid }, { $pull: { projects: pid } });

		res.status(200).send('Members update successfull.');

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

//#endregion

//#region Query for project tasks: ADD, REMOVE, UPDATE, FILE UPLOAD.

exports.addTask = async (req, res, next) => {
	try {
		let pid = req.body._pid;
		if (!pid) return res.status(400).send('_pid not found from the body.');

		let taskName = req.body.taskName;
		if (!taskName) return res.status(400).send('TaskName not found from the body.');

		let project = await Project.findById(pid);
		if (!project) return res.status(400).send('Project not found.');

		let { status, assigned, deadline } = req.body;

		project.tasks.push({
			taskName,
			assigned,
			status,
			deadline,
			taskFolderId: '',
		});

		let pushedTask = await project.save();

		res.status(200).send({ message: 'Added task successfully.', result: pushedTask });

		let subdocs = pushedTask.$getAllSubdocs();
		let latestDoc = subdocs[subdocs.length - 1];

		req.latestTask = { latestDoc, pushedTask };

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

exports.removeTask = async (req, res, next) => {
	try {
		let pid = req.params.pid;
		if (!pid) return res.status(400).send('_pid not found from the body.');

		let tid = req.params.tid;
		if (!tid) return res.status(400).send('_tid not found from the body.');

		// find the project and remove the task property using pull from the project collection.
		let findAndRemoveTask = await Project.findByIdAndUpdate(
			{ _id: pid },
			{ $pull: { tasks: { _id: tid } } },
			{ useFindAndModify: false, new: true }
		);

		if (!findAndRemoveTask) return res.status(400).send('Removal of task failed.');

		res.status(200).send({ message: 'Task removed successfully.', result: findAndRemoveTask });

		return next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

exports.updateTask = async (req, res, next) => {
	try {
		let pid = req.body._pid;
		if (!pid) return res.status(400).send('_pid not found from the body.');

		let tid = req.body._tid;
		if (!tid) return res.status(400).send('_tid not found from the body.');

		let project = await Project.findById(pid);
		if (!project) return res.status(400).send('Project not found.');

		let subdoc = project.tasks.id(tid);

		for (let key in req.body.update) {
			subdoc[key] = req.body.update[key];
		}

		let savedProject = await project.save();

		res.status(200).send({ message: 'Task updated successfully.', result: savedProject });

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

//#endregion

//#region Query for project tasks messages: GET.

exports.getMessages = async (req, res, next) => {
	try {
		let tid = req.params.tid;
		if (!tid) return res.status(400).send('task id not valid.');

		let findProjectTask = await Project.findOne({ 'tasks._id': tid });
		if (!findProjectTask) return res.status(400).send('task doesnt exist.');

		let populateMessage = await findProjectTask
			.populate({
				path: 'tasks.assigned',
				select: 'name email avatar',
			})
			.execPopulate({
				path: 'tasks.messages',
				model: Message,
				populate: { path: 'author', model: User, select: 'name email avatar' },
			});

		let findTask = populateMessage.tasks.id(tid);

		res.status(200).json(findTask);
		return next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

//#endregion

//#region Query for project tasks upload: UPLOAD, DELETE, GENERATE A LINK

exports.fileUploadTask = async (req, res, next) => {
	const uploadPath = './src/uploads';

	try {
		const startUpload = promisify(upload);

		fs.access(uploadPath, (err) => {
			if (err) fs.mkdirSync(uploadPath);
		});

		await startUpload(req, res);

		return next();
	} catch (error) {
		// console.error(error);
		if (error.name === 'MulterError') res.status(400).send(error.message);
		return;
	}
};

//#endregion
