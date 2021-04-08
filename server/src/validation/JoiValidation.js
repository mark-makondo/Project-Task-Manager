const Joi = require('@hapi/joi');

/**
 * Checks if the incomming data has a name, email and password.
 *
 * @param {data: Object} data
 * @returns
 */
exports.registerValidation = (data) => {
	const validation = Joi.object({
		name: Joi.string().max(255).required(),
		email: Joi.string()
			.max(255)
			.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
			.required(),
		password: Joi.string().min(6).required(),
		avatar: Joi.string(),
		// only used for determining /user-not-found/register.
		path: Joi.string().max(255),
	});

	return validation.validate(data);
};

/**
 * Checks if the incomming data contains email and password.
 * And if the email is valid or not.
 *
 * @param {data: Object} data
 * @returns
 */
exports.loginValidation = (data) => {
	const validation = Joi.object({
		email: Joi.string()
			.max(255)
			.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
			.required(),
		password: Joi.string().min(6).required(),
	});

	return validation.validate(data);
};

/**
 * Checks if the incomming data has a current, new and confirm password,
 * then checks if new and confirm password is equal or not.
 *
 * @param {data: Object} data
 * @returns
 */
exports.changePassValidation = (data) => {
	const validation = Joi.object({
		currentPassword: Joi.string().min(6).required().label('Current Password'),
		newPassword: Joi.string().min(6).required().label('New Password'),
		confirmNewPassword: Joi.any()
			.equal(Joi.ref('newPassword'))
			.required()
			.label('Confirm New Password')
			.messages({ 'any.only': '{{#label}} does not match' }),
	});

	return validation.validate(data);
};
