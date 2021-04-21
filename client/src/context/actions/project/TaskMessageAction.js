import axiosInstance from '../../../helper/axiosInstance.js';
import {
	TASK_MESSAGE_LOADING,
	TASK_MESSAGE_GET,
	TASK_MESSAGE_ADD,
	TASK_MESSAGE_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const TaskMessageGetAction = (tid) => async (taskMessageDispatch) => {
	try {
		taskMessageDispatch({
			type: TASK_MESSAGE_LOADING,
		});

		let res = await axiosInstance().get(`/project/task/message/${tid}`);

		taskMessageDispatch({
			type: TASK_MESSAGE_GET,
			payload: res.data,
		});
	} catch (err) {
		taskMessageDispatch({
			type: TASK_MESSAGE_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

export const TaskMessageAddAction = (data) => async (taskMessageDispatch) => {
	try {
		taskMessageDispatch({
			type: TASK_MESSAGE_LOADING,
		});

		taskMessageDispatch({
			type: TASK_MESSAGE_ADD,
			payload: data,
		});
	} catch (err) {
		taskMessageDispatch({
			type: TASK_MESSAGE_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
