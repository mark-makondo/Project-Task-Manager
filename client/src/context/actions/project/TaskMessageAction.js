import axiosInstance from '../../../helper/axiosInstance.js';

import {
	TASK_MESSAGE_LOADING,
	TASK_MESSAGE_SUCCESS,
	TASK_MESSAGE_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const TaskMessageAction = (tid, type) => async (taskMessageDispatch) => {
	try {
		taskMessageDispatch({
			type: TASK_MESSAGE_LOADING,
		});

		let res;

		if (type === 'get') {
			res = await axiosInstance().get(`/project/task/message/${tid}`);
		}

		taskMessageDispatch({
			type: TASK_MESSAGE_SUCCESS,
			payload: res.data,
		});
	} catch (err) {
		taskMessageDispatch({
			type: TASK_MESSAGE_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
