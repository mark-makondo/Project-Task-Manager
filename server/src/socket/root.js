/**
 * socket initial connections
 *
 * @param {socket} io
 */
module.exports = (io) => {
	io.on('connection', (socket) => {
		console.log('current socket user', socket.id);

		// socket.on('join', (tid) => {
		// 	// socket.join(tid);
		// 	console.log('joined', data);
		// 	// socket.to(data).emit('receive_message', data);
		// });

		require('./chat')(socket, io);
		require('./notificationListener')(socket, io);

		// require('./notification')(socket, io);
		// require('./notificationResponse')(socket, io)

		require('./tableChanges')(socket, io);

		socket.on('disconnect', () => {
			console.log('disconnected');
		});
	});
};
