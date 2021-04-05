const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			max: 255,
			required: true,
		},
		email: {
			type: String,
			max: 255,
			required: true,
			index: { unique: true },
		},
		password: {
			type: String,
			max: 1024,
			min: 6,
			required: true,
		},
		avatar: {
			type: String,
			max: 1024,
			required: true,
		},
	},
	{ timeStamps: true }
);

const User = mongoose.model('users', userSchema);

module.exports = { User };
