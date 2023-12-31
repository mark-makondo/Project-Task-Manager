import axiosInstance from '../../../helper/axiosInstance.js';

import {
	REGISTER_LOADING,
	REGISTER_SUCCESS,
	REGISTER_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const RegisterAction = (input, history = null) => async (authDispatch) => {
	try {
		authDispatch({
			type: REGISTER_LOADING,
		});

		const res = await axiosInstance().post('/user/register', input);

		/**
		 * if this is true that means we are on /user-not-found/register,
		 * then store jwt token to make it redirect to dashboard
		 */
		if (input.path === 'google-proceed') localStorage.jwt_token = res.data.jwt_token;

		if (history) {
			if (!!res) {
				history.push('/');
			}
		}

		authDispatch({
			type: REGISTER_SUCCESS,
			payload: res.data,
		});
	} catch (err) {
		authDispatch({
			type: REGISTER_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
