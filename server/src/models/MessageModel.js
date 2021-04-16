const mongoose = require('mongoose');
require('mongoose-type-url');

const messageSchema = mongoose.Schema({
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'user',
	},
	message: {
		type: String,
	},
	dateCreated: {
		type: String,
	},
	type: {
		type: String,
	},
	url: { type: mongoose.SchemaTypes.Url },
});

const Message = mongoose.model('message', messageSchema);

module.exports = { Message };
