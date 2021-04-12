import {
	TASK_LOADING,
	TASK_SUCCESS,
	TASK_ERROR,
	GET_PROJECT_LOADING,
	GET_PROJECT_SUCCESS,
	GET_PROJECT_ERROR,
} from '../../constants/actionTypes/ActionTypes.js';

const GetOneProjectReducer = (state, { payload, type }) => {
	switch (type) {
		case TASK_LOADING:
		case GET_PROJECT_LOADING:
			return {
				...state,
				getOneProject: {
					...state.auth,
					error: false,
					isLoading: true,
				},
			};
		case TASK_SUCCESS:
		case GET_PROJECT_SUCCESS:
			return {
				...state,
				getOneProject: {
					...state.auth,
					error: false,
					isLoading: false,
					data: payload,
				},
			};
		case TASK_ERROR:
		case GET_PROJECT_ERROR:
			return {
				...state,
				getOneProject: {
					...state.auth,
					isLoading: false,
					error: payload,
				},
			};
		default:
			return state;
	}
};

export default GetOneProjectReducer;
