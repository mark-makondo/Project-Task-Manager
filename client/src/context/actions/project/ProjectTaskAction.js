import axiosInstance from '../../../helper/axiosInstance.js';

import {
	TASK_GET,
	TASK_LOADING,
	TASK_CREATE,
	TASK_REMOVE,
	TASK_UPDATE,
	TASK_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const TaskActionGet = (pid) => async (TaskDispatch) => {
	try {
		TaskDispatch({
			type: TASK_LOADING,
		});

		let tasks = await axiosInstance().get(`/project/${pid}/tasks`);

		TaskDispatch({
			type: TASK_GET,
			payload: tasks.data,
		});
	} catch (err) {
		TaskDispatch({
			type: TASK_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

export const TaskActionCreate = (input) => async (TaskDispatch) => {
	try {
		TaskDispatch({
			type: TASK_LOADING,
		});

		let newTask = await axiosInstance().post('/project/task/add', input);

		TaskDispatch({
			type: TASK_CREATE,
			payload: newTask.data.result2,
		});
	} catch (err) {
		TaskDispatch({
			type: TASK_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

export const TaskActionRemove = (input) => async (TaskDispatch) => {
	try {
		TaskDispatch({
			type: TASK_LOADING,
		});

		await axiosInstance().delete(`/project/task/remove/${input._pid}/${input._tid}`);

		TaskDispatch({
			type: TASK_REMOVE,
			payload: input._tid,
		});
	} catch (err) {
		TaskDispatch({
			type: TASK_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
