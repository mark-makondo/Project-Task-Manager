/**
 * socket chat connections
 *
 * @param {socket} io
 */
const chatSocket = (socket, io) => {
	let roomFlag = '';

	socket.on('join', (room) => {
		roomFlag = room;
		socket.join(room);

		// console.log(`${socket.id} joined the room ${room}`);
	});

	socket.on('send_message', async (data) => {
		let room = data._tid;

		io.to(room).emit('received_message', data.content);
	});
};

module.exports = chatSocket;
