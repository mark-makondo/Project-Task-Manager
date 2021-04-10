import axiosInstance from '../../../helper/axiosInstance.js';

import {
	UPDATE_USER_LOADING,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const UpdateUser = () => async (updateUserDispatch) => {
	try {
		updateUserDispatch({
			type: UPDATE_USER_LOADING,
		});

		const res = await axiosInstance().get(`/user/update`, {
			headers: {
				jwt_token: localStorage.jwt_token,
			},
		});

		updateUserDispatch({
			type: UPDATE_USER_SUCCESS,
			payload: res.data,
		});
	} catch (err) {
		updateUserDispatch({
			type: UPDATE_USER_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
