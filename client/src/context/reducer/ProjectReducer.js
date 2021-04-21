import {
	PROJECT_LOADING,
	PROJECT_GETALL,
	PROJECT_CREATE,
	PROJECT_REMOVE,
	PROJECT_ERROR,
} from '../../constants/actionTypes/ActionTypes.js';

const ProjectReducer = (state, { payload, type }) => {
	switch (type) {
		case PROJECT_LOADING:
			return {
				...state,
				project: {
					...state.project,
					error: false,
					isLoading: true,
				},
			};
		case PROJECT_GETALL:
			return {
				...state,
				project: {
					isLoading: false,
					data: payload,
					error: false,
				},
			};
		case PROJECT_CREATE:
			return {
				...state,
				project: {
					isLoading: false,
					data: [...state.project.data, payload],
					error: false,
				},
			};
		case PROJECT_REMOVE:
			return {
				...state,
				project: {
					isLoading: false,
					data: state.project.data.filter((project) => {
						return project._id !== payload;
					}),
					error: false,
				},
			};
		case PROJECT_ERROR:
			return {
				...state,
				project: {
					...state.project,
					isLoading: false,
					error: payload,
				},
			};
		default:
			return state;
	}
};

export default ProjectReducer;
