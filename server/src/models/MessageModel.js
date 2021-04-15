const mongoose = require('mongoose');

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
});

const Message = mongoose.model('message', messageSchema);

module.exports = { Message };
