const mongoose = require('mongoose');
require('mongoose-type-url');

const projectSchema = mongoose.Schema(
	{
		projectName: { type: String, required: true },
		companyEmail: { type: String, required: true },
		projectFolderId: { type: String },
		owner: {
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: 'user',
		},
		members: [
			{
				_id: { type: mongoose.Schema.ObjectId, ref: 'user' },
				isAccepted: { type: Boolean, default: 'false' },
				joinedDate: { type: String, default: 'pending' },
			},
		],
		tasks: [
			{
				_id: { type: mongoose.Schema.ObjectId, auto: true },
				taskName: { type: String },
				status: { type: String },
				assigned: { type: mongoose.Schema.ObjectId, ref: 'user' },
				deadline: { type: String },
				created_at: { type: Date, default: Date.now() },
				fileUpload: [
					{
						_id: { type: mongoose.Schema.ObjectId, auto: true },
						googleDownloadLink: { type: mongoose.SchemaTypes.Url },
						googleViewLink: { type: mongoose.SchemaTypes.Url },
						fileName: { type: String },
					},
				],
				messages: [{ type: mongoose.Schema.ObjectId, ref: 'message' }],
				taskFolderId: { type: String },
			},
		],
	},
	{ timestamps: true }
);

const Project = mongoose.model('project', projectSchema);

module.exports = { Project };
