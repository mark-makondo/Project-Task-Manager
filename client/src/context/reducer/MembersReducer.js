import {
	GET_MEMBERS_LOADING,
	GET_MEMBERS_SUCCESS,
	GET_MEMBERS_ERROR,
	REMOVE_MEMBERS_LOADING,
	REMOVE_MEMBERS_SUCCESS,
	REMOVE_MEMBERS_ERROR,
} from '../../constants/actionTypes/ActionTypes.js';

const MembersReducer = (state, { payload, type }) => {
	switch (type) {
		case REMOVE_MEMBERS_LOADING:
		case GET_MEMBERS_LOADING:
			return {
				...state,
				members: {
					...state.members,
					error: false,
					isLoading: true,
				},
			};
		case REMOVE_MEMBERS_SUCCESS:
		case GET_MEMBERS_SUCCESS:
			return {
				...state,
				members: {
					...state.members,
					error: false,
					isLoading: false,
					data: payload,
				},
			};
		case REMOVE_MEMBERS_ERROR:
		case GET_MEMBERS_ERROR:
			return {
				...state,
				members: {
					...state.members,
					isLoading: false,
					error: payload,
				},
			};
		default:
			return state;
	}
};

export default MembersReducer;
