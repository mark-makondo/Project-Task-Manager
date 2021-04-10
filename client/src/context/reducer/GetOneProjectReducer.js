import {
	GET_PROJECT_LOADING,
	GET_PROJECT_SUCCESS,
	GET_PROJECT_ERROR,
} from '../../constants/actionTypes/ActionTypes.js';

const GetOneProjectReducer = (state, { payload, type }) => {
	switch (type) {
		case GET_PROJECT_LOADING:
			return {
				...state,
				getOneProject: {
					...state.auth,
					error: false,
					isLoading: true,
				},
			};
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
