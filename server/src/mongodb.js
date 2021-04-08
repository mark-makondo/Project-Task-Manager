const mongoose = require('mongoose');
const config = require('../config');

class Mongoose {
	constructor() {
		this.client = mongoose;
		this.url = config.mongoDB.url;
		this.options = config.mongoDB.options;
	}

	/**
	 * Connect method for mongodb
	 *
	 * @returns
	 */
	async connect() {
		try {
			return await this.client.connect(this.url, this.options);
		} catch (error) {
			return console.error(error);
		}
	}

	/**
	 * Run method for mongodb.
	 * Call this method when initializing mongodb
	 * in the the server.
	 *
	 * @param {server} server
	 * @param {port} port
	 * @returns
	 */
	async run(server, port) {
		try {
			let connect = await this.connect();
			if (!connect) console.log('Database MongoDB connection failed.');

			console.log('Database MongoDB is connected.');

			server.listen(port, () => console.log(`Server running on port: ${port}.`));
		} catch (error) {
			return console.error(error);
		}
	}
}

module.exports = Mongoose;
