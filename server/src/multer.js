const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

let absolutePath = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'src/uploads');
	},

	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			cb(null, raw.toString('hex') + Date.now() + '.' + file.originalname);
		});
	},
});

// const imageFilterV1 = (req, file, cb) => {
// 	const ext = path.extname(file.originalname);
// 	if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
// 		return cb(res.status(400).end('only jpg, png, mp4 is allowed', false));
// 	}
// 	cb(null, true);
// };

const imageFilterV2 = (req, file, cb) => {
	// Accept images only
	if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
		req.isImage = false;
		return cb(null, false);
	}
	req.isImage = true;
	cb(null, true);
};

module.exports = upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: imageFilterV2 }).single(
	'file'
);
