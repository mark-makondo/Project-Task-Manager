import axiosInstance from '../../../helper/axiosInstance.js';

import {
	USER_FOUND,
	USER_NOT_FOUND,
	USER_LOADING,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const GetUserInfo = (history, id) => async (userDispatch) => {
	try {
		userDispatch({
			type: USER_LOADING,
		});

		const res = await axiosInstance(history).get(`/user/${id}`, {
			headers: {
				jwt_token: localStorage.jwt_token,
			},
		});

		userDispatch({
			type: USER_FOUND,
			payload: res.data,
		});
	} catch (err) {
		if (err.response.data === 'User not found.') {
			window.location.replace('/');
			localStorage.removeItem('jwt_token');
		}

		userDispatch({
			type: USER_NOT_FOUND,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
