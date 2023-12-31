import {
	TASK_LOADING,
	TASK_GET,
	TASK_CREATE,
	TASK_UPDATE,
	TASK_REMOVE,
	TASK_ERROR,
} from '../../constants/actionTypes/ActionTypes.js';

const ProjectTaskReducer = (state, { payload, type }) => {
	switch (type) {
		case TASK_LOADING:
			return {
				...state,
				projectTasks: {
					...state.projectTasks,
					error: false,
					isLoading: true,
				},
			};
		case TASK_GET:
			return {
				...state,
				projectTasks: {
					isLoading: false,
					data: payload,
					error: false,
				},
			};
		case TASK_CREATE:
			return {
				...state,
				projectTasks: {
					isLoading: false,
					data: [...state.projectTasks.data, payload],
					error: false,
				},
			};
		case TASK_UPDATE:
			let updatedTask = state.projectTasks.data.map((task) => {
				if (task._id === payload.result._id) return payload.result;
				return task;
			});

			return {
				...state,
				projectTasks: {
					isLoading: false,
					data: updatedTask,
					error: false,
				},
			};
		case TASK_REMOVE:
			return {
				...state,
				projectTasks: {
					isLoading: false,
					data: state.projectTasks.data.filter((task) => {
						return task._id !== payload;
					}),
					error: false,
				},
			};
		case TASK_ERROR:
			return {
				...state,
				projectTasks: {
					...state.projectTasks,
					error: payload,
					isLoading: false,
				},
			};
		default:
			return state;
	}
};

export default ProjectTaskReducer;
