const { promisify } = require('util');
const upload = require('../multer');
const fs = require('fs');
const path = require('path');
const socket = require('../server.js');

// models
const { Project } = require('../models/ProjectModel');
const { User } = require('../models/UserModel');
const { Message } = require('../models/MessageModel');

//#region Query for projects : CREATE, FIND ALL OR ONE, DELETE.
exports.create = async (req, res, next) => {
	try {
		let id = req.user._id;
		if (!id) return res.status(400).send('Id not found from jwt token.');

		let user = await User.findById(id);
		if (!user) return res.status(400).send('No user found.');

		let projectName = req.body.projectName;
		if (!projectName) return res.status(400).send('Project name is required.');

		let companyEmail = req.body.companyEmail;
		if (!companyEmail) return res.status(400).send('Company email is required.');
		else if (companyEmail.slice(-9) !== 'gmail.com') return res.status(400).send('Email must be a gmail account.');

		let project = await new Project({
			projectName: projectName,
			companyEmail: req.body.companyEmail,
			owner: user._id,
			projectFolderId: '',
		}).execPopulate({ path: 'owner', select: 'name email avatar' });

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
		if (!id) return res.status(400).send('Id not found from jwt token.');

		let user = await User.findById(id);
		if (!user) return res.status(400).send('No user found.');

		let userData = await user.execPopulate({
			path: 'projects',
			model: Project,
			populate: [
				{ path: 'members._id', select: '_id name email avatar' },
				{ path: 'owner', select: 'name email avatar' },
				{ path: 'tasks.assigned', select: 'name email avatar' },
			],
		});

		return res.status(200).send(userData.projects);
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

exports.findOne = async (req, res, next) => {
	try {
		let user = req.user;

		let pid = req.params.pid;
		if (!pid) return res.status(400).send('Parameter id not found.');

		let findProject = await Project.findById(pid);
		if (!findProject) return res.status(400).send('Project not found.');

		let project = await findProject
			.populate({ path: 'owner', select: 'name email avatar' })
			.populate('members._id')
			.populate({
				path: 'tasks.assigned',
				select: 'name email avatar',
			})
			.execPopulate();

		return res.status(200).send({ project, user });
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
		if (!project) return res.status(400).send('Project removal failed.');

		let membersId = project.members.map((id) => id._id);

		// get all the matching id using $in and pull out the project from the users collection.
		if (membersId.length !== 0) {
			await User.updateMany(
				{ _id: { $in: [...membersId, project.owner._id] } },
				{ $pull: { projects: pid } },
				{
					multi: true,
					new: true,
				}
			);
			return res.sendStatus(200);
		}

		await User.updateOne({ _id: project.owner._id }, { $pull: { projects: pid } });

		return res.sendStatus(200);
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

//#endregion

//#region Query for project members: ADD, REMOVE GET.
exports.addMember = async (req, res, next) => {
	try {
		let uid = req.user._id;
		let pid = req.body._pid;
		let memberToInviteEmail = req.body.memberToInviteEmail;

		let memberToInvite = await User.find({ email: memberToInviteEmail });
		if (memberToInvite.length === 0) return res.status(400).send('The email is not a valid user.');

		let findMember = await Project.find({ _id: pid, 'members._id': memberToInvite[0]._id });
		if (findMember.length === 1) return res.status(400).send('User is already a member.');
		else if (memberToInviteEmail === req.user.email) return res.status(400).send('Action not allowed.');

		let project = await Project.findById(pid);

		project.members.push(memberToInvite[0]);

		await project.save();

		let { members } = await project.execPopulate({
			path: 'members._id',
			select: 'name email avatar',
		});

		let latestDoc = members[members.length - 1];

		socket.io.emit('invitation_sent', { success: true, result: latestDoc, currentUserId: uid });

		return res.status(200).send(latestDoc);
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

exports.removeMember = async (req, res, next) => {
	try {
		let mid = req.params.mid;
		if (!mid) return res.status(400).send('mid path not found from body.');

		let pid = req.params.pid;
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

		return res.status(200).send({ success: true, message: 'Members update successfull.' });
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

exports.getMembers = async (req, res, next) => {
	try {
		let pid = req.params.pid;

		let findProject = await Project.findById(pid);

		if (findProject) {
			let { members } = await findProject.execPopulate({
				path: 'members._id',
				select: 'name email avatar',
			});

			return res.status(200).send(members);
		}

		return res.sendStatus(200);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};
//#endregion

//#region Query for project tasks: ADD, REMOVE, UPDATE, GET.
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

		let subdocs = pushedTask.$getAllSubdocs();
		let latestDoc = subdocs[subdocs.length - 1];

		let projectTasks = await project.execPopulate({
			path: 'tasks.assigned',
			select: 'name email avatar',
			model: User,
		});

		let populatedTask = projectTasks.tasks.id(latestDoc._id);

		res.status(200).send({ message: 'Added task successfully.', result: pushedTask, result2: populatedTask });

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

		return res.status(200).send({ message: 'Task removed successfully.', result: findAndRemoveTask });
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

		let projectTasks = await project.execPopulate({
			path: 'tasks.assigned',
			select: 'name email avatar',
			model: User,
		});

		let subdoc = projectTasks.tasks.id(tid);

		for (let key in req.body.update) {
			subdoc[key] = req.body.update[key];
		}

		let savedProject = await project.save();
		let updatedTask = savedProject.tasks.id(tid);

		return res.status(200).send({ message: 'Task updated successfully.', result: updatedTask });
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

exports.getTasks = async (req, res, next) => {
	try {
		let pid = req.params.pid;

		let project = await Project.findById(pid);
		if (!project) res.status(400).send('Project not found.');

		if (project.tasks.length !== 0) {
			let projectTasks = await project.execPopulate({
				path: 'tasks.assigned',
				select: 'name email avatar',
				model: User,
			});
			return res.status(200).send(projectTasks.tasks);
		}

		return res.status(200).send(project.tasks);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};
//#endregion

//#region Query for project tasks messages: GET, ADD.
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

		return res.status(200).json(findTask);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

exports.addMessage = async (req, res, next) => {
	try {
		let userId = req.user._id;

		let { _tid, content } = req.body;
		let { message, dateCreated, type, url } = content;

		if (!url || url === '') url = '';

		let saveToMessage = {
			author: userId,
			message,
			dateCreated,
			type,
			url,
		};

		let msg = new Message(saveToMessage);

		let populatedMsg = await msg.execPopulate({ path: 'author', model: User, select: 'name email avatar' });

		let savedMsg = await populatedMsg.save();

		let findProjectTask = await Project.findOne({ 'tasks._id': _tid });
		if (!findProjectTask) return res.status(400).send('task doesnt exist.');

		let subdoc = findProjectTask.tasks.id(_tid);
		subdoc.messages.push(savedMsg);

		await findProjectTask.save();

		return res.status(200).send(savedMsg);
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

//#endregion

//#region Query for project tasks upload: UPLOAD, DELETE, GENERATE A LINK
exports.fileUploadTask = async (req, res, next) => {
	const uploadPath = path.join(__dirname, '../', 'uploads');

	try {
		const startUpload = promisify(upload);

		fs.access(uploadPath, (err) => {
			if (err) fs.mkdirSync(uploadPath);
		});

		await startUpload(req, res);

		return next();
	} catch (error) {
		console.error(error);
		if (error.name === 'MulterError') return res.status(400).send(error.message);
		return;
	}
};

//#endregion
