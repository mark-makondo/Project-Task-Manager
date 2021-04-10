import axiosInstance from '../../../helper/axiosInstance.js';

import {
	LOGIN_LOADING,
	LOGIN_SUCCESS,
	LOGIN_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const LoginAction = (input) => async (authDispatch) => {
	try {
		authDispatch({
			type: LOGIN_LOADING,
		});

		let res;

		let isLoginPath = input.path === 'login';
		let isGoogleProceedPath = input.path === 'google-proceed';

		if (isLoginPath) {
			res = await axiosInstance().post('/user/login', input);
		} else if (isGoogleProceedPath) {
			res = await axiosInstance().post('/user/google', {
				token: input.response.tokenId,
			});
		}

		localStorage.jwt_token = res.data.jwt_token;

		authDispatch({
			type: LOGIN_SUCCESS,
			payload: res.data,
		});
	} catch (err) {
		authDispatch({
			type: LOGIN_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
