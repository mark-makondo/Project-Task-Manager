const package = require('./package.json');

/**
 * All configs will be stored here.
 */
const config = {
	applicationName: package.name,
	mongoDB: {
		url: process.env.MONGODB_CONNECTION_STRING,
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		},
	},
};

module.exports = config;
