// model
const { Project } = require('../model/ProjectModel');
const { User } = require('../model/UserModel');

//#region Query for projects : Create, Find all, Find one, Delete
/**
 * Create a project for the user and push
 * the the project id to the user.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.create = async (req, res, next) => {
	try {
		// check if id exist on jwt token from verify middleware.
		let id = req.user._id;
		if (!id) res.status(400).send('Id not found from jwt token.');

		// check if the user exist in the database.
		let user = await User.findById(id);
		if (!user) return res.status(400).send('No user found.');

		// insert new project.
		let project = new Project({
			projectName: req.body.projectName,
			companyEmail: req.body.companyEmail,
			owner: user._id,
		});

		// save the new data to project collection.
		let savedProject = await project.save();

		// then push the data to projects property of user collection.
		user.projects.push(savedProject);

		// save the user to update our user collection.
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
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.findAllUserProjects = async (req, res, next) => {
	try {
		// check if id exist on jwt token from verify middleware.
		let id = req.user._id;
		if (!id) res.status(400).send('Id not found from jwt token.');

		// check if the user exist in the database
		let user = await User.findById(id);
		if (!user) return res.status(400).send('No user found.');

		// then do deep populate for projects and members property of project and user collection.
		let projects = await user.execPopulate({
			path: 'projects',
			model: Project,
			populate: { path: 'members._id', model: User },
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
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.findOne = async (req, res, next) => {
	try {
		// check if id params exist in requested path.
		let pid = req.params.pid;
		if (!params) res.status(400).send('Parameter id not found.');

		// check if project exists in the projects collection.
		let project = await Project.findById(pid);
		if (!project) res.status(400).send('Project not found.');

		res.status(200).send(project);

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

/**
 * requires a params of pid, deletes the corresponding project document together with
 * its references from user collection.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.deleteProject = async (req, res, next) => {
	try {
		// check if pid exist in path parameters.
		let pid = req.params.pid;
		if (!pid) return res.status(400).send('pid not found from path parameters.');

		// delete the corresponding project using pid.
		let project = await Project.findOneAndDelete({ _id: pid }, { useFindAndModify: false });
		if (!project) return res.send.status(400).send('Project removal failed.');

		// map the members array to get the id.
		let membersId = project.members.map((id) => id._id);

		// assign the owners id to a variable.
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

//#region Query for project members: Add, Remove
/**
 * Add and update member property to our project
 * collection. Requires user 'id' and project 'pid' parameters from body.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.addMember = async (req, res, next) => {
	try {
		// check if user id exists.
		let id = req.body._id;
		if (!id) return res.status(400).send('id not found.');

		// check if project id exists.
		let pid = req.body._pid;
		if (!pid) return res.status(400).send('pid not found.');

		// check if user was found.
		let user = await User.findById(id);
		if (!user) return res.status(400).send('User not found.');

		// check if the project exists.
		let project = await Project.findById(pid);
		if (!project) return res.status(400).send('Project not found.');

		// check if the user is already a member.
		let findFilter = { _id: pid, 'members._id': user._id };
		let findMember = await Project.find(findFilter);
		if (findMember.length !== 0) return res.status(400).send('User is already a member.');

		// push the updates to user and project collection.
		project.members.push(user);
		user.projects.push(project);

		// save to update the project and user collection.
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
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.removeMember = async (req, res, next) => {
	try {
		// check if members id exists.
		let mid = req.body._mid;
		if (!mid) return res.status(400).send('mid path not found from body.');

		// check if project id exists.
		let pid = req.body._pid;
		if (!pid) return res.status(400).send('pid not found not found from body.');

		// remove the specified member's id from our project collection.
		await Project.updateOne(
			{ _id: pid },
			{
				$pull: { members: { _id: mid } },
			}
		);

		// then also remove the specified project's id from our user collection.
		await User.updateOne({ _id: mid }, { $pull: { projects: pid } });

		res.status(200).send('Members update successfull.');

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

//#endregion

//#region Query for project tasks: Add, Remove, Update
/**
 * Requires '_pid' and 'taskName' parameter on the body.
 * Add a task to the project collection.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.addTask = async (req, res, next) => {
	try {
		// check if _pid paramater exist on the body.
		let pid = req.body._pid;
		if (!pid) return res.status(400).send('_pid not found from the body.');

		// check if taskName parameter exist on the body.
		let taskName = req.body.taskName;
		if (!taskName) return res.status(400).send('TaskName not found from the body.');

		// check if project id exist on the project collection.
		let project = await Project.findById(pid);
		if (!project) return res.status(400).send('Project not found.');

		// push new data to tasks property of our project collection.
		project.tasks.push({ taskName });

		// save to update the project collection.
		let savedProject = await project.save();

		res.status(200).send({ message: 'Added task successfully.', result: savedProject });

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

/**
 * Requires '_pid' project id and '_tid' task id from the body.
 * Removes a task from project collection.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.removeTask = async (req, res, next) => {
	try {
		// check if _pid exists on the body.
		let pid = req.body._pid;
		if (!pid) return res.status(400).send('_pid not found from the body.');

		// check if _tid exists on the body.
		let tid = req.body._tid;
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
		// console.error(error);
		return next(error);
	}
};

/**
 * Requires '_pid' and '_tid' on body parameters.
 * Requires 'taskName', 'status', 'assigned', 'deadline' as well.
 * Update a set of values in the tasks property of project collection.
 * The default value of 'assigned' value must be the owner's
 * id in the client side.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.updateTask = async (req, res, next) => {
	try {
		// check if _pid exists on the body.
		let pid = req.body._pid;
		if (!pid) return res.status(400).send('_pid not found from the body.');

		// check if _tid exists on the body.
		let tid = req.body._tid;
		if (!tid) return res.status(400).send('_tid not found from the body.');

		// check if project id exist on the project collection.
		let project = await Project.findById(pid);
		if (!project) return res.status(400).send('Project not found.');

		// organize the received data to be used for update.
		let taskContent = {
			taskName: req.body.taskName,
			status: req.body.status,
			assigned: req.body.assigned,
			deadline: req.body.deadline,
		};

		// get the sub documents of our task property of project collection using the task id.
		let subdoc = project.tasks.id(tid);

		// destructure the resulted object and update the values.
		subdoc['taskName'] = taskContent.taskName;
		subdoc['status'] = taskContent.status;
		subdoc['assigned'] = taskContent.assigned;
		subdoc['deadline'] = taskContent.deadline;

		// save to update the values of project collection.
		let savedProject = project.save();

		res.status(200).send({ message: 'Task updated successfully.', result: savedProject });

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};
//#endregion
