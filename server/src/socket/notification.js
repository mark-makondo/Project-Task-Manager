const mongoose = require('mongoose');

// models
const { User } = require('../models/UserModel');
const { Project } = require('../models/ProjectModel');

/**
 * socket notification connections
 *
 * @param {socket} io
 */
const notificationSocket = (socket, io) => {
	const sendStatus = (data) => socket.emit('status', data);

	socket.on('send_notification', async (content) => {
		let { sendType, data } = content;
		let { senderData, sentDate, project, type } = data;
		let { projectName, projectId } = project;

		let formatToSend = {
			_id: mongoose.Types.ObjectId(),
			sender: senderData,
			response: 'none',
			hasRead: false,
			type,
			dateReceived: sentDate,
			project: {
				_id: projectId,
				projectName,
			},
		};

		await pushNotification(io, data, sendStatus, formatToSend, sendType);
	});
};

const pushNotification = async (io, data, sendStatus, formatToSend, sendType) => {
	try {
		let { senderData, emailToInvite, project } = data;
		let senderEmail = senderData.email;
		let pid = project.projectId;
		// let uid = senderData._id;
		let formatToPush = formatToSend;

		let findEmailIfExist = await User.findOne({ email: emailToInvite });

		if (!findEmailIfExist) return sendStatus({ senderEmail, message: 'The email is not a valid user.' });
		if (findEmailIfExist.email === senderEmail) return sendStatus({ senderEmail, message: 'Action not allowed.' });

		let findMember = await Project.find({ _id: pid, 'members._id': findEmailIfExist._id });
		if (findMember.length !== 0) return sendStatus({ senderEmail, message: 'User is already a member.' });

		// emit the notification now
		await io.emit('received_notification', formatToSend);

		await findEmailIfExist.notifications.push(formatToPush);

		if (sendType === 'new') {
			await sendStatus({ senderEmail, message: 'Invitation sent!' });

			// add the receipient to the project pending members.
			let project = await Project.findById(pid);
			project.members.push(findEmailIfExist);

			await project.save();
		}

		await findEmailIfExist.save();
	} catch (error) {
		console.log(error);
	}
};

module.exports = notificationSocket;
