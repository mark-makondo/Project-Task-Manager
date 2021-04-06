const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// validation
const {
	registerValidation,
	loginValidation,
	changePassValidation,
} = require('../middleware/JoiValidation.js');

// model
const { User } = require('../model/UserModel');

/**
 * User route to get started.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.initial = async (req, res) => {
	res.send('user routes initials');
};

/**
 * Receives a post request google token
 * and decodeds it.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.googleLogin = async (req, res, next) => {
	try {
		const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

		const { token } = req.body;
		if (!token) return res.status(400).send('Google login failed.');

		const decodedToken = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
		const { name, email, picture } = decodedToken.getPayload();

		// check if email exist in database
		const user = await User.findOne({ email });

		// if email doesn't exist send a patch to redirect the user to register
		if (!user) {
			return res.json({
				name,
				email,
				avatar: picture,
				redirect: '/no-user-found/register',
			});
		}

		// combine data
		const gatheredData = {
			_id: user._id,
			name,
			email,
			avatar: picture,
		};

		// create a jwt token
		const jwt_token = jwt.sign(gatheredData, process.env.JWT_SECRET, {
			expiresIn: 604800, // 1 week
		});

		//put the token on the header and send it back if success
		res
			.header('jwt_token', jwt_token)
			.send({ jwt_token, result: gatheredData });

		return next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

/**
 * Register method for user route.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.register = async (req, res, next) => {
	try {
		// perform register validation
		const { error } = registerValidation(req.body);

		// if error send message response
		if (error) return res.status(400).send(error.details[0].message);

		// email duplication validation
		const isEmailExist = await User.findOne({ email: req.body.email });
		if (isEmailExist) return res.status(400).send('Email already exists!');

		// generate salt and combine with current password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		// if client path is on google proceed
		const isGoogleProceed = req.body.path === 'google-proceed';

		let tempAvatar;

		if (isGoogleProceed) {
			tempAvatar = req.body.avatar;
		} else {
			tempAvatar = 'no-avatar';
		}

		// add user to the database
		const user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
			avatar: tempAvatar,
		});

		// destructure data
		const { _id, name, email, avatar } = await user.save();

		// combine data
		const gatheredData = {
			_id,
			name,
			email,
			avatar,
		};

		/**
		 * if this is true that means the client is on /user-not-found/register,
		 * then create a jwt to make it redirect to dashboard in the client
		 */
		if (isGoogleProceed) {
			// create a jwt token
			const jwt_token = jwt.sign(gatheredData, process.env.JWT_SECRET, {
				expiresIn: 604800, // 1 week
			});
			res.json({ jwt_token, result: gatheredData });
		} else {
			res.send(gatheredData);
		}

		return next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

/**
 * Login method for user route.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.login = async (req, res, next) => {
	try {
		// do validation and destructure error and value
		const { error } = loginValidation(req.body.input);

		// if error send the message response
		if (error) return res.status(400).send(error.details[0].message);

		// if email exist
		const user = await User.findOne({ email: req.body.input.email });
		if (!user) return res.status(400).send(`Email doesn't exist.`);

		// valid password
		const validPassword = await bcrypt.compare(
			req.body.input.password,
			user.password
		);
		if (!validPassword) return res.status(400).send('Invalid password.');

		// destructure data
		const { _id, name, email, avatar } = user;

		// combine data
		const gatheredData = {
			_id,
			name,
			email,
			avatar,
		};

		// create a jwt token
		const jwt_token = jwt.sign(gatheredData, process.env.JWT_SECRET, {
			expiresIn: 604800, // 1 week
		});

		//put the token on the header and send it back if success
		res
			.header('jwt_token', jwt_token)
			.send({ jwt_token, result: gatheredData });

		return next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

/**
 * Query users
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.find = async (req, res, next) => {
	try {
		// I can also use the req.user from the verify here instead of params
		if (req.params.id) {
			let id = req.params.id;
			let findSingleUser = await User.findById(id);

			if (!findSingleUser) return res.status(400).send('User not found.');

			res.send(findSingleUser);
		}

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

/**
 * Update user
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.update = async (req, res, next) => {
	try {
		if (!req.user) return res.status(400).send('No data to update');

		// get the id decoded jwt from the middle ware verify
		let id = req.user._id;

		let findUserAndUpdate = await User.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			useFindAndModify: false,
		});

		if (!findUserAndUpdate)
			return res.status(400).send(`Unable to update user with ${id}`);

		res.send('Update Success');

		return next();
	} catch (error) {
		// console.error(error)
		return next(error);
	}
};
