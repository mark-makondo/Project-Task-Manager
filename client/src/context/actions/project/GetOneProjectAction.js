import axiosInstance from '../../../helper/axiosInstance.js';

import {
	GET_PROJECT_LOADING,
	GET_PROJECT_SUCCESS,
	GET_PROJECT_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const GetOneProjectAction = (pid) => async (getOneProjectDispatch) => {
	try {
		getOneProjectDispatch({
			type: GET_PROJECT_LOADING,
		});

		let res = await axiosInstance().get(`/project/find/${pid}`);

		console.log(res.data);
		getOneProjectDispatch({
			type: GET_PROJECT_SUCCESS,
			payload: res.data,
		});
	} catch (err) {
		getOneProjectDispatch({
			type: GET_PROJECT_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
