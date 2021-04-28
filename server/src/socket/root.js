/**
 * socket initial connections
 *
 * @param {socket} io
 */
module.exports = (io) => {
	io.on('connection', (socket) => {
		// console.log(`${socket.id} connected`);

		require('./chat')(socket, io);
		require('./notificationListener')(socket, io);
		require('./tableChanges')(socket, io);

		socket.on('disconnect', () => {
			// console.log(`${socket.id} disconnected`);
		});

		socket.on('connect_error', function () {
			console.log('error!');
			socket.io.close();
		});
	});
};
