const jwt = require('jsonwebtoken');

/**
 * Checks if the jwt token header is equal to the user jwt token
 * if not throw an error if true grants access together with the
 * decoded jwt token. 'req.user' contains the decoded token.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const jwtVerify = async (req, res, next) => {
	try {
		const token = req.header('jwt_token');

		if (!token) return res.status(401).send('Access Denied');

		// if token is equal to the env token, grants access and return the decoded data.
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;

		//once we have the auth token we can proceed through next.
		return next();
	} catch (error) {
		// console.error(error);
		return next('Invalid Token');
	}
};

module.exports = jwtVerify;
