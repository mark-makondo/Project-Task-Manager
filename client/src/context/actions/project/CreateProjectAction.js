import axiosInstance from '../../../helper/axiosInstance.js';
import Query from '../../../helper/query.js';

import {
	CREATE_PROJECT_LOADING,
	CREATE_PROJECT_SUCCESS,
	CREATE_PROJECT_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const CreateProjectAction = (input) => async (createProjectDispatch) => {
	try {
		createProjectDispatch({
			type: CREATE_PROJECT_LOADING,
		});

		let createProject = await axiosInstance().post('/project/create', input);
		let getAllProject = await axiosInstance().get('/project/findAll');

		if (createProject.data) {
			let createProjectContent = Query.dropdownCreateProjectButton();
			let createProjectButton = Query.dropdownCreateProjectContent();

			createProjectContent.classList.remove('active');
			createProjectButton.classList.remove('active');
		}

		alert('Project Created Successfully');

		createProjectDispatch({
			type: CREATE_PROJECT_SUCCESS,
			payload: getAllProject.data,
		});
	} catch (err) {
		createProjectDispatch({
			type: CREATE_PROJECT_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
