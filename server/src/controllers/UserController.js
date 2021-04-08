const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');

// validation
const {
	registerValidation,
	loginValidation,
	changePassValidation,
} = require('../validation/JoiValidation');

// models
const { User } = require('../models/UserModel');

//#region Login and Register for users.
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
		let client = new OAuth2Client(config.googleCredentials.CLIENT_ID);

		let { token } = req.body;
		if (!token) return res.status(400).send('Google login failed.');

		let decodedToken = await client.verifyIdToken({
			idToken: token,
			audience: config.googleCredentials.CLIENT_ID,
		});

		let { name, email, picture } = decodedToken.getPayload();

		let user = await User.findOne({ email });

		// if email doesn't exist send a path to redirect the user to register.
		if (!user) {
			return res.send({
				name,
				email,
				avatar: picture,
				redirect: '/no-user-found/register',
			});
		}

		let gatheredData = {
			_id: user._id,
			name,
			email,
			avatar: picture,
		};

		let jwt_token = jwt.sign(gatheredData, config.userAuth.JWT_SECRET, {
			expiresIn: 604800, // 1 week
		});

		res.status(200).header('jwt_token', jwt_token).send({ jwt_token, result: gatheredData });

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

/**
 * Two types of register is happening: normal register and when
 * the user uses a gmail account for google login that is still not yet
 * registered to the database.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.register = async (req, res, next) => {
	try {
		let { error } = registerValidation(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let isEmailExist = await User.findOne({ email: req.body.email });
		if (isEmailExist) return res.status(400).send('Email already exists!');

		let salt = await bcrypt.genSalt(10);
		let hashedPassword = await bcrypt.hash(req.body.password, salt);

		// conditional check if the request is comming from google-proceed or normal register.
		let isGoogleProceed = req.body.path === 'google-proceed';
		let tempAvatar;
		if (isGoogleProceed) {
			tempAvatar = req.body.avatar;
		} else {
			tempAvatar = 'no-avatar';
		}

		let user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
			avatar: tempAvatar,
		});

		let { _id, name, email, avatar } = await user.save();

		let gatheredData = {
			_id,
			name,
			email,
			avatar,
		};

		/**
		 * if this is true that means the client is on /user-not-found/register.
		 * We need to send the user directly to the dashboard after he succeeded
		 * filling up the form. We do this by sending a path property and handle
		 * the redirect in the client.
		 *
		 */
		if (isGoogleProceed) {
			let jwt_token = jwt.sign(gatheredData, config.userAuth.JWT_SECRET, {
				expiresIn: 604800, // 1 week
			});
			res.status(200).header('jwt_token', jwt_token).send({ jwt_token, result: gatheredData });
		} else {
			res.status(200).send(gatheredData);
		}

		return next();
	} catch (error) {
		// console.error(error);
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
		let { error } = loginValidation(req.body.input);
		if (error) return res.status(400).send(error.details[0].message);

		let user = await User.findOne({ email: req.body.input.email });
		if (!user) return res.status(400).send(`Email doesn't exist.`);

		let validPassword = await bcrypt.compare(req.body.input.password, user.password);
		if (!validPassword) return res.status(400).send('Invalid password.');

		let { _id, name, email, avatar } = user;

		let gatheredData = {
			_id,
			name,
			email,
			avatar,
		};

		let jwt_token = jwt.sign(gatheredData, config.userAuth.JWT_SECRET, {
			expiresIn: 604800, // 1 week
		});

		res.status(200).header('jwt_token', jwt_token).send({ jwt_token, result: gatheredData });

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

//#endregion

//#region User operations: Find, Update, Change password.
/**
 * Find method for a single user.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.find = async (req, res, next) => {
	try {
		// we can also use the req.user from the verify here instead of params
		// since it also returns a decoded jwt token.
		if (req.params.id) {
			let id = req.params.id;
			let findSingleUser = await User.findById(id);

			if (!findSingleUser) return res.status(400).send('User not found.');

			res.status(200).send(findSingleUser);
		}

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

/**
 * Update user.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.update = async (req, res, next) => {
	try {
		let id = req.user._id;
		if (!id) return res.status(400).send('_id not found from user');

		let findUserAndUpdate = await User.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			useFindAndModify: false,
		});
		if (!findUserAndUpdate) return res.status(400).send(`Unable to update user with ${id}`);

		res.status(200).send('Update Success');

		return next();
	} catch (error) {
		// console.error(error)
		return next(error);
	}
};

/**
 * Change password method for user.
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.changePassword = async (req, res, next) => {
	try {
		let id = req.params.id;
		if (!id) return res.status(400).send('user id does not exist on the path params.');

		let currentPassword = req.body.currentPassword;
		if (!currentPassword) return res.status(400).send('Current password input not found.');

		let newPassword = req.body.newPassword;
		if (!newPassword) return res.status(400).send('New password input not found.');

		// checks if current and confirm new password is equal through joi.
		const { error, value } = changePassValidation(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let user = await User.findById(id);
		if (!user) return res.status(400).send(`Unable to update find user with ${id}`);

		const validPassword = await bcrypt.compare(req.body.currentPassword, user.password);
		if (!validPassword) return res.status(400).send('Invalid password.');

		const salt = await bcrypt.genSalt(10);
		const hashedNewPassword = await bcrypt.hash(value.newPassword, salt);

		const updatePassword = await user.updateOne({ password: hashedNewPassword });
		if (!updatePassword) return res.status(400).send('password update failed.');

		res.status(200).send({ message: 'Password changed successfully.', result: hashedNewPassword });

		return next();
	} catch (error) {
		// console.error(error);
		return next(error);
	}
};

//#endregion
