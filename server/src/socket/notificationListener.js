// models
const { User } = require('../models/UserModel');
const { Project } = require('../models/ProjectModel');

/**
 * socket notification response connections when a user
 * accepted or decline a notification.
 *
 * @param {socket} io
 */
const notificationListener = (socket, io) => {
	const sendStatus = (statusData) => socket.emit('status', statusData);

	socket.on('send_notif', async (content) => {
		if (content.notifType === 'acceptInvite' || content.notifType === 'declineInvite') {
			await updateMember(content, sendStatus, io);
			await addNotification(content, io);
		} else if (content.notifType === 'deleteProject') {
			if (content.emailToNotif.length !== 0) await batchAddNotification(content, io);
		} else {
			await addNotification(content, io);
		}
	});
};

const batchAddNotification = async (content, io) => {
	try {
		let { emailToNotif, dataToPush } = content;
		let { sender, type, _pid, projectName, response } = dataToPush;

		let formatSender = {
			_id: sender._id,
			name: sender.name,
			email: sender.email,
			avatar: sender.avatar,
		};

		let formatToPush = {
			sender: formatSender,
			response,
			hasRead: false,
			type,
			dateReceived: new Date(),
			project: {
				_id: _pid,
				projectName,
			},
		};

		await User.updateMany(
			{ email: { $in: emailToNotif } },
			{
				$push: { notifications: formatToPush },
			},
			{ multi: true, new: true }
		);

		io.emit('rcv_notif', { emailToNotif, result: formatToPush, originalData: content });
	} catch (error) {
		console.error(error);
	}
};

const addNotification = async (content, io) => {
	try {
		let { emailToNotif, dataToPush } = content;
		let { sender, type, _pid, projectName, response } = dataToPush;

		let findEmail = await User.find({ email: emailToNotif });
		let findUser = await User.findById(findEmail[0]._id);

		let formatSender = {
			_id: sender._id,
			name: sender.name,
			email: sender.email,
			avatar: sender.avatar,
		};

		let formatToPush = {
			sender: formatSender,
			response,
			hasRead: false,
			type,
			dateReceived: new Date(),
			project: {
				_id: _pid,
				projectName,
			},
		};

		findUser.notifications.push(formatToPush);

		let pushedNotification = await findUser.save();

		let subdocs = pushedNotification.$getAllSubdocs();
		let latestDoc = subdocs[subdocs.length - 1];

		let latestSingleNotification = findUser.notifications.id(latestDoc._id);

		io.emit('rcv_notif', { emailToNotif, result: latestSingleNotification, originalData: content });
	} catch (error) {
		console.error(error);
	}
};

const updateMember = async (content, sendStatus, io) => {
	try {
		let { dataToPush, notifType, emailToNotif } = content;
		let { sender, _pid } = dataToPush;

		if (notifType === 'acceptInvite') {
			let findUser = await User.findById(sender._id);
			let findProject = await Project.findById(_pid);

			let subdocs = findProject.members.id(sender._id);
			subdocs['isAccepted'] = true;
			subdocs['joinedDate'] = new Date(Date.now()).toDateString();

			findUser.projects.push(findProject);

			await findUser.save();
			await findProject.save();
		} else if (notifType === 'declineInvite') {
			await Project.updateOne(
				{ _id: _pid },
				{
					$pull: { members: { _id: sender._id } },
				}
			);
		}

		await sendStatus({
			statusType: 'members_updated_broadcast_to_self',
			success: true,
			message: 'Member added to the project.',
		});

		await io.emit('members_updated_broadcast_to_owner', { success: true, emailToNotif, _pid });
	} catch (error) {
		console.error(error);
	}
};

module.exports = notificationListener;
