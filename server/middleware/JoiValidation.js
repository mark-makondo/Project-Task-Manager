const Joi = require('@hapi/joi');

exports.registerValidation = (data) => {
	const validation = Joi.object({
		name: Joi.string().max(255).required(),
		email: Joi.string()
			.max(255)
			.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
			.required(),
		password: Joi.string().min(6).required(),
		avatar: Joi.string(),
		// only used for determining /user-not-found/register
		path: Joi.string().max(255),
	});

	return validation.validate(data);
}; // validation for register

exports.loginValidation = (data) => {
	const validation = Joi.object({
		email: Joi.string()
			.max(255)
			.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
			.required(),
		password: Joi.string().min(6).required(),
	});

	return validation.validate(data);
}; // validation for register

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
}; // validation for changing password
