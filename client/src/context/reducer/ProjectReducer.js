import {
	GET_ALL_PROJECT_LOADING,
	GET_ALL_PROJECT_SUCCESS,
	GET_ALL_PROJECT_ERROR,
	CREATE_PROJECT_LOADING,
	CREATE_PROJECT_SUCCESS,
	CREATE_PROJECT_ERROR,
} from '../../constants/actionTypes/ActionTypes.js';

const ProjectReducer = (state, { payload, type }) => {
	switch (type) {
		case CREATE_PROJECT_LOADING:
		case GET_ALL_PROJECT_LOADING:
			return {
				...state,
				project: {
					...state.auth,
					error: false,
					isLoading: true,
				},
			};
		case CREATE_PROJECT_SUCCESS:
		case GET_ALL_PROJECT_SUCCESS:
			return {
				...state,
				project: {
					...state.auth,
					error: false,
					isLoading: false,
					data: payload,
				},
			};

		case CREATE_PROJECT_ERROR:
		case GET_ALL_PROJECT_ERROR:
			return {
				...state,
				project: {
					...state.auth,
					isLoading: false,
					error: payload,
				},
			};
		default:
			return state;
	}
};

export default ProjectReducer;
