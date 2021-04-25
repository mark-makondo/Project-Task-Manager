import axiosInstance from '../../../helper/axiosInstance.js';

import {
	USER_LOADING,
	USER_GET,
	USER_UPDATE,
	USER_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

/**
 * get user informations.
 */
export const GetUserInfo = (history, id) => async (userDispatch) => {
	try {
		userDispatch({
			type: USER_LOADING,
		});

		const res = await axiosInstance(history).get(`/user/${id}`);

		userDispatch({
			type: USER_GET,
			payload: res.data,
		});
	} catch (err) {
		if (err.response.data === 'User not found.') {
			window.location.replace('/');
			localStorage.removeItem('jwt_token');
		}

		userDispatch({
			type: USER_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * update user informations.
 */
export const UpdateUserInfo = (input, setIsEditable) => async (userDispatch) => {
	try {
		userDispatch({
			type: USER_LOADING,
		});

		let res = await axiosInstance().put(`/user/update`, input);

		!!res.data && setIsEditable(false);

		userDispatch({
			type: USER_UPDATE,
			payload: input,
		});
	} catch (err) {
		userDispatch({
			type: USER_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * update user informations.
 */
export const ChangeUserPassword = (data, setIsChangingPassword) => async (userDispatch) => {
	try {
		userDispatch({
			type: USER_LOADING,
		});
		let { id, formatToUpdate } = data;

		const res = await axiosInstance().put(`/user/change-password/${id}`, formatToUpdate);

		!!res.data && setIsChangingPassword(false);

		userDispatch({
			type: USER_UPDATE,
			payload: res.data,
		});
	} catch (err) {
		console.log(err.response.data);
		userDispatch({
			type: USER_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
