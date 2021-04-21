// models
const { Project } = require('../models/ProjectModel');
const { User } = require('../models/UserModel');

/**
 * socket notification response connections when a user
 * accepted or decline a notification.
 *
 * @param {socket} io
 */
const notificationResponseSocket = (socket, io) => {
	const sendStatus = (data) => socket.emit('status', data);

	socket.on('send_notification_response', async (content) => {
		let { sendType, data } = content;

		// io.emit('received_notification_response', formatToSend);

		if (sendType === 'updateMemberStatus') {
			await updateNotification(data, sendStatus);
			await updateMember(data, sendStatus);
		} else if (sendType === 'updateNotification') {
			await updateNotification(data, sendStatus);
		}
	});
};

const updateNotification = async (data, sendStatus) => {
	try {
		let { currentUser, notificationId, response } = data;

		let currentUserId = currentUser._id;

		let findUser = await User.findById(currentUserId);
		let notification = findUser.notifications.id(notificationId);

		notification['hasRead'] = true;
		notification['response'] = response;

		await findUser.save();

		await sendStatus({ senderId: currentUserId, message: 'Notifications Updated!' });
	} catch (error) {
		console.error(error);
	}
};

const updateMember = async (data, sendStatus) => {
	try {
		let { currentUser, projectId, response } = data;
		let membersId = currentUser._id;

		if (response === 'accepted') {
			let findUser = await User.findById(membersId);
			let findProject = await Project.findById(projectId);

			let subdocs = findProject.members.id(membersId);
			subdocs['isAccepted'] = true;
			subdocs['joinedDate'] = new Date(Date.now()).toDateString();

			findUser.projects.push(findProject);

			await findUser.save();
			await findProject.save();
		} else if (response === 'declined') {
			await Project.updateOne(
				{ _id: projectId },
				{
					$pull: { members: { _id: membersId } },
				}
			);
		}

		return sendStatus({ senderId: membersId, message: 'Update Success.', sendType: 'membersUpdated' });
	} catch (error) {
		console.error(error);
	}
};

module.exports = notificationResponseSocket;
