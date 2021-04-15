import {
	TASK_MESSAGE_LOADING,
	TASK_MESSAGE_SUCCESS,
	TASK_MESSAGE_ERROR,
} from '../../constants/actionTypes/ActionTypes.js';

const TaskMessageReducer = (state, { payload, type }) => {
	switch (type) {
		case TASK_MESSAGE_LOADING:
			return {
				...state,
				taskMessage: {
					...state.taskMessage,
					error: false,
					isLoading: true,
				},
			};
		case TASK_MESSAGE_SUCCESS:
			return {
				...state,
				taskMessage: {
					...state.taskMessage,
					error: false,
					isLoading: false,
					data: payload,
				},
			};
		case TASK_MESSAGE_ERROR:
			return {
				...state,
				taskMessage: {
					...state.taskMessage,
					isLoading: false,
					error: payload,
				},
			};

		default:
			return state;
	}
};

export default TaskMessageReducer;
