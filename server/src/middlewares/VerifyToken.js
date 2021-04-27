const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * Checks if the request contains a jwt_token header.
 * 'req.user' contains the decoded token.
 */
const jwtVerify = async (req, res, next) => {
	try {
		const token = req.header('jwt_token');
		if (!token) return res.status(401).send('Access Denied');

		const verified = jwt.verify(token, config.userAuth.JWT_SECRET);
		req.user = verified;

		return next();
	} catch (error) {
		// console.error(error);
		return next('Invalid Token');
	}
};

module.exports = jwtVerify;
