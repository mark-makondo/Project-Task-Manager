import {
	PROJECT_MEMBERS_LOADING,
	PROJECT_MEMBERS_ADD,
	PROJECT_MEMBERS_GET,
	PROJECT_MEMBERS_REMOVE,
	PROJECT_MEMBERS_ERROR,
} from '../../constants/actionTypes/ActionTypes.js';

const ProjectMembersReducer = (state, { payload, type }) => {
	switch (type) {
		case PROJECT_MEMBERS_LOADING:
			return {
				...state,
				projectMembers: {
					...state.projectMembers,
					error: false,
					isLoading: true,
				},
			};
		case PROJECT_MEMBERS_ADD:
			return {
				...state,
				projectMembers: {
					isLoading: false,
					data: [...state.projectMembers.data, payload],
					error: false,
				},
			};
		case PROJECT_MEMBERS_GET:
			return {
				...state,
				projectMembers: {
					isLoading: false,
					data: payload,
					error: false,
				},
			};
		case PROJECT_MEMBERS_REMOVE:
			return {
				...state,
				projectMembers: {
					isLoading: false,
					data: state.projectMembers.data.filter((member) => {
						return member._id._id !== payload;
					}),
					error: false,
				},
			};

		case PROJECT_MEMBERS_ERROR:
			return {
				...state,
				projectMembers: {
					...state.projectMembers,
					error: payload,
					isLoading: false,
				},
			};
		default:
			return state;
	}
};
export default ProjectMembersReducer;
