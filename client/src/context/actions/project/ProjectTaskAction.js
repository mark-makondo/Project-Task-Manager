import axiosInstance from '../../../helper/axiosInstance.js';
import {
	TASK_LOADING,
	TASK_GET,
	TASK_CREATE,
	TASK_REMOVE,
	TASK_UPDATE,
	TASK_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

/**
 * get tasks
 */
export const TaskActionGet = (pid) => async (projectTaskDispatch) => {
	try {
		projectTaskDispatch({
			type: TASK_LOADING,
		});

		let tasks = await axiosInstance().get(`/project/${pid}/tasks`);

		projectTaskDispatch({
			type: TASK_GET,
			payload: tasks.data,
		});
	} catch (err) {
		projectTaskDispatch({
			type: TASK_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * create tasks
 */
export const TaskActionCreate = (data) => async (projectTaskDispatch) => {
	try {
		projectTaskDispatch({
			type: TASK_LOADING,
		});

		projectTaskDispatch({
			type: TASK_CREATE,
			payload: data,
		});
	} catch (err) {
		projectTaskDispatch({
			type: TASK_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * remove tasks
 */
export const TaskActionRemove = (tid) => async (projectTaskDispatch) => {
	try {
		projectTaskDispatch({
			type: TASK_LOADING,
		});

		projectTaskDispatch({
			type: TASK_REMOVE,
			payload: tid,
		});
	} catch (err) {
		projectTaskDispatch({
			type: TASK_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * update tasks
 */
export const TaskActionUpdate = (data) => async (projectTaskDispatch) => {
	try {
		projectTaskDispatch({
			type: TASK_LOADING,
		});

		projectTaskDispatch({
			type: TASK_UPDATE,
			payload: data,
		});
	} catch (err) {
		projectTaskDispatch({
			type: TASK_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
