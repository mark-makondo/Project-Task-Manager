const package = require('./package.json');

/**
 * All configs will be stored here.
 */
const config = {
	applicationName: package.name,

	socket: {
		CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
		ALL: '*',
	},

	mongoDB: {
		url: process.env.MONGODB_CONNECTION_STRING,
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		},
	},

	googleCredentials: {
		// Generated from the google console project section using oauth2Client mainly used
		// for google login. The googlePrivateKey.json in the root folder is a service
		// google account for google drive upload so it's a separate file than this one.

		CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		CLIENT_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
	},

	userAuth: {
		JWT_SECRET: process.env.JWT_SECRET,
	},
};

module.exports = config;
