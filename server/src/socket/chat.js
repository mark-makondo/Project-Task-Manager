// models
const { Project } = require('../models/ProjectModel');
const { User } = require('../models/UserModel');
const { Message } = require('../models/MessageModel');

/**
 * socket chat connections
 *
 * @param {socket} io
 */
const chatSocket = (socket, io) => {
	socket.on('send_message', async (data) => {
		let room = data._tid;
		socket.join(room);

		let res = await postMessages(data);

		io.to(room).emit('received_message', res);
	});
};

const postMessages = async (data) => {
	try {
		let { _id, _tid, content } = data;
		let { message, dateCreated, type, url } = content;

		if (!url || url === '') url = '';

		let saveToMessage = {
			author: _id,
			message,
			dateCreated,
			type,
			url,
		};

		let msg = new Message(saveToMessage);
		let savedMsg = await msg.save();

		let findProjectTask = await Project.findOne({ 'tasks._id': _tid });
		if (!findProjectTask) return console.error('task doesnt exist.');

		let subdoc = findProjectTask.tasks.id(_tid);
		subdoc.messages.push(savedMsg);

		await findProjectTask.save();

		let findMessage = await Message.findOne({ _id: savedMsg._id });
		let populatedMessage = findMessage.execPopulate({
			path: 'author',
			model: User,
			select: 'name email avatar',
		});

		return populatedMessage;
	} catch (error) {
		console.error(error);
	}
};

module.exports = chatSocket;
