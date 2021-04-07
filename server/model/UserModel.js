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
		},
		projects: [{ type: mongoose.Schema.ObjectId, ref: 'project' }],
	},
	{ timestamps: true }
);

const User = mongoose.model('user', userSchema);

module.exports = { User };
