// models
const { Project } = require('../models/ProjectModel');
const { User } = require('../models/UserModel');

//#region Query for projects : Create, Find all, Find one, Delete.
/**
 * Create a project for the user and push.
 * the project id to the user. The req.projectFolderId.
 * and req.user came from the middleware.
 */
exports.create = async (req, res, next) => {
	try {
		let id = req.user._id;
		let user = await User.findById(id);

		let project = new Project({
			projectName: req.body.projectName,
			companyEmail: req.body.companyEmail,
			owner: user._id,
			projectFolderId: req.projectFolderId,
		});

		let savedProject = await project.save();

		user.projects.push(savedProject);

		await user.save();

		res.status(200).send(savedProject);

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

/**
 * populate all the users project property to get all the project informations,
 * then do populate again for the project's member property to get all the
 * member's information.
 */
exports.findAllUserProjects = async (req, res, next) => {
	try {
		let id = req.user._id;
		if (!id) res.status(400).send('Id not found from jwt token.');

		let user = await User.findById(id);
		if (!user) return res.status(400).send('No user found.');

		// do deep populate for projects and members property of project and user collection.
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

/**
 * requires a params of pid, deletes the corresponding project document together with
 * its references from user collection.
 */
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

//#region Query for project members: Add, Remove.
/**
 * Add and update member property to our project collection.
 * Requires user 'id' and project 'pid' parameters from body.
 */
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

/**
 * Required a body parameters of '_mid' member's id and project's id '_pid'.
 * Removes a member from a project collection as well as removing the
 * project on  user collection.
 */
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

//#region Query for project tasks: Add, Remove, Update, File upload.
/**
 * Requires '_pid' and 'taskName' parameter on the body.
 * Add a task to the project collection, then send a new req
 * property 'projectFolderId' to next middleware.
 */
exports.addTask = async (req, res, next) => {
	try {
		let pid = req.body._pid;
		if (!pid) return res.status(400).send('_pid not found from the body.');

		// let taskName = req.body.taskName;
		// if (!taskName) return res.status(400).send('TaskName not found from the body.');

		let project = await Project.findById(pid);
		if (!project) return res.status(400).send('Project not found.');

		let { taskName, status, assigned, deadline } = req.body;

		project.tasks.push({
			taskName,
			assigned,
			status,
			deadline,
		});

		let savedProject = await project.save();

		res.status(200).send({ message: 'Added task successfully.', result: savedProject });

		// req.savedProject = savedProject;
		// req.addedTask = { pid: savedProject._id, companyEmail: savedProject.companyEmail };

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

/**
 * Requires '_pid' project id and '_tid' task id from the body.
 * Removes a task from project collection.
 */
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

/**
 * body format must contain _pid and_tid property and one object that contains
 * the property that we are going to update.
 */
exports.updateTask = async (req, res, next) => {
	try {
		let pid = req.body._pid;
		if (!pid) return res.status(400).send('_pid not found from the body.');

		let tid = req.body._tid;
		if (!tid) return res.status(400).send('_tid not found from the body.');

		let project = await Project.findById(pid);
		if (!project) return res.status(400).send('Project not found.');

		let subdoc = project.tasks.id(tid);

		for (let el in req.body.update) {
			subdoc[el] = req.body.update[el];
		}

		let savedProject = project.save();

		res.status(200).send({ message: 'Task updated successfully.', result: savedProject });

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

//#endregion

//#region Query for project tasks upload: upload, delete, generate a link.
exports.fileUploadTask = async (req, res, next) => {
	try {
		// if (!pid) return res.status(400).send('_pid not found from the body.');

		// res.status(200).send({ message: 'Task updated successfully.', result: savedProject });

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

//#endregion
