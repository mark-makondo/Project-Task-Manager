// models
const { User } = require('../models/UserModel');
const { Project } = require('../models/ProjectModel');

/**
 * socket notification response connections when a user
 * accepted or decline a notification.
 *
 * @param {socket} io
 */
const tableChangesSocket = (socket, io) => {
	// const sendStatus = (data) => socket.emit('status', data);

	socket.on('row_send_update', async (content) => {
		io.emit('row_receive_update', content);
	});
};

module.exports = tableChangesSocket;
