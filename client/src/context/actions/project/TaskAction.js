import axiosInstance from '../../../helper/axiosInstance.js';

import {
	TASK_LOADING,
	TASK_SUCCESS,
	TASK_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const TaskAction = (input, type) => async (getOneProjectDispatch) => {
	try {
		getOneProjectDispatch({
			type: TASK_LOADING,
		});

		let findUpdatedProject;

		if (type === 'create') {
			await axiosInstance().post('/project/task/add', input);
		} else if (type === 'update') {
			await axiosInstance().put('/project/task/update', input);
		} else if (type === 'remove') {
			await axiosInstance().delete(`/project/task/remove/${input._pid}/${input._tid}`);
		} else if (type === 'removeProject') {
			await axiosInstance().delete(`/project/delete/${input._pid}`);
			window.location.replace(`/${input._id}/dashboard/project-overview`);
		}

		findUpdatedProject = await axiosInstance().get(`/project/find/${input._pid}`);

		getOneProjectDispatch({
			type: TASK_SUCCESS,
			payload: findUpdatedProject.data,
		});
	} catch (err) {
		getOneProjectDispatch({
			type: TASK_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
