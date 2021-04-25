import { USER_LOADING, USER_GET, USER_UPDATE, USER_ERROR } from '../../constants/actionTypes/ActionTypes.js';

const UserReducer = (state, { payload, type }) => {
	switch (type) {
		case USER_LOADING: {
			return {
				...state,
				user: {
					...state.user,
					isLoading: true,
					error: false,
				},
			};
		}
		case USER_GET: {
			return {
				...state,
				user: {
					isLoading: false,
					data: payload,
					error: false,
				},
			};
		}
		case USER_UPDATE: {
			return {
				...state,
				user: {
					isLoading: false,
					data: { ...state.user.data, ...payload },
					error: false,
				},
			};
		}
		case USER_ERROR: {
			return {
				...state,
				user: {
					...state.user,
					error: payload,
					isLoading: false,
				},
			};
		}
		default:
			return state;
	}
};

export default UserReducer;
