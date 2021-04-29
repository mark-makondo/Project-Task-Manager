import axiosInstance from '../../../helper/axiosInstance.js';
import Query from '../../../helper/query.js';
import {
	PROJECT_LOADING,
	PROJECT_GETALL,
	PROJECT_CREATE,
	PROJECT_REMOVE,
	PROJECT_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

/**
 * Get all projects.
 */
export const GetAllProjectAction = () => async (projectDispatch) => {
	try {
		projectDispatch({
			type: PROJECT_LOADING,
		});

		let project = await axiosInstance().get('/project/findAll');

		projectDispatch({
			type: PROJECT_GETALL,
			payload: project.data,
		});
	} catch (err) {
		projectDispatch({
			type: PROJECT_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * Create project.
 */
export const CreateProjectAction = (input) => async (projectDispatch) => {
	try {
		projectDispatch({
			type: PROJECT_LOADING,
		});

		let project = await axiosInstance().post('/project/create', input);

		if (project.data) {
			let createProjectContent = Query.dropdownCreateProjectButton();
			let createProjectButton = Query.dropdownCreateProjectContent();

			createProjectContent.classList.remove('active');
			createProjectButton.classList.remove('active');
		}

		projectDispatch({
			type: PROJECT_CREATE,
			payload: project.data,
		});
	} catch (err) {
		projectDispatch({
			type: PROJECT_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * Remove project.
 */
export const RemoveProjectAction = (input, history) => async (projectDispatch) => {
	try {
		projectDispatch({
			type: PROJECT_LOADING,
		});

		let userId = input._id;
		let projectId = input._pid;

		let res = await axiosInstance().delete(`/project/delete/${projectId}`);
		if (res.data) history.push(`/${userId}/dashboard/project-overview`);

		projectDispatch({
			type: PROJECT_REMOVE,
			payload: userId,
		});
	} catch (err) {
		projectDispatch({
			type: PROJECT_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
