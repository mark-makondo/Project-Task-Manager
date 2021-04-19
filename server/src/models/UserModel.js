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
		notifications: [
			{
				_id: { type: mongoose.Schema.ObjectId },
				dateReceived: { type: String },
				hasRead: { type: Boolean, default: false },
				type: { type: String },
				sender: { _id: { type: String }, name: { type: String }, email: { type: String }, avatar: { type: String } },
				response: { type: String, default: 'none' },
				project: { _id: { type: String }, projectName: { type: String } },
			},
		],
	},
	{ timestamps: true }
);

const User = mongoose.model('user', userSchema);

module.exports = { User };
