import {
	REGISTER_LOADING,
	REGISTER_SUCCESS,
	REGISTER_ERROR,
	LOGIN_LOADING,
	LOGIN_SUCCESS,
	LOGIN_ERROR,
	LOGOUT_USER,
} from '../../constants/actionTypes/ActionTypes.js';

import AuthInitialState from '../initialStates/AuthInitialStates.js';

const AuthReducer = (state, { payload, type }) => {
	switch (type) {
		case REGISTER_LOADING:
		case LOGIN_LOADING:
			return {
				...state,
				auth: {
					...state.auth,
					error: false,
					loading: true,
				},
			};
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			return {
				...state,
				auth: {
					error: false,
					loading: false,
					user: payload,
				},
			};
		case REGISTER_ERROR:
		case LOGIN_ERROR:
			return {
				...state,
				auth: {
					...state.auth,
					loading: false,
					error: payload,
				},
			};
		case LOGOUT_USER:
			return {
				...state,
				AuthInitialState,
			};
		default:
			return state;
	}
};

export default AuthReducer;
