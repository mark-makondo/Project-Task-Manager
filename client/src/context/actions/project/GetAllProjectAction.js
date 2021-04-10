import axiosInstance from '../../../helper/axiosInstance.js';

import {
	GET_ALL_PROJECT_LOADING,
	GET_ALL_PROJECT_SUCCESS,
	GET_ALL_PROJECT_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const GetAllProjectAction = () => async (projectDispatch) => {
	try {
		projectDispatch({
			type: GET_ALL_PROJECT_LOADING,
		});

		let res = await axiosInstance().get('/project/findAll');

		projectDispatch({
			type: GET_ALL_PROJECT_SUCCESS,
			payload: res.data,
		});
	} catch (err) {
		projectDispatch({
			type: GET_ALL_PROJECT_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
