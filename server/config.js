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
	googleCredentials: {
		CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		CLIENT_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
	},
	userAuth: {
		JWT_SECRET: process.env.JWT_SECRET,
	},
};

module.exports = config;
