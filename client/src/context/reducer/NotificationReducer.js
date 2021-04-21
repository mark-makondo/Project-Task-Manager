import {
	NOTIFICATION_LOADING,
	NOTIFICATION_GET,
	NOTIFICATION_CREATE,
	NOTIFICATION_UPDATE,
	NOTIFICATION_REMOVE,
	NOTIFICATION_ERROR,
} from '../../constants/actionTypes/ActionTypes.js';

const ProjectTaskReducer = (state, { payload, type }) => {
	switch (type) {
		case NOTIFICATION_LOADING:
			return {
				...state,
				notifications: {
					...state.notifications,
					error: false,
					isLoading: true,
				},
			};
		case NOTIFICATION_GET:
			return {
				...state,
				notifications: {
					isLoading: false,
					data: payload,
					error: false,
				},
			};
		case NOTIFICATION_CREATE:
			return {
				...state,
				notifications: {
					isLoading: false,
					data: [...state.notifications.data, payload],
					error: false,
				},
			};
		case NOTIFICATION_UPDATE:
			let updatedNotification = state.notifications.data.map((notification) => {
				if (notification._id === payload._id) return payload;
				return notification;
			});

			return {
				...state,
				notifications: {
					isLoading: false,
					data: updatedNotification,
					error: false,
				},
			};
		case NOTIFICATION_REMOVE:
			return {
				...state,
				notifications: {
					isLoading: false,
					data: state.notifications.data.filter((notification) => {
						return notification._id !== payload;
					}),
					error: false,
				},
			};
		case NOTIFICATION_ERROR:
			return {
				...state,
				notifications: {
					...state.notifications,
					error: payload,
					isLoading: false,
				},
			};
		default:
			return state;
	}
};

export default ProjectTaskReducer;
