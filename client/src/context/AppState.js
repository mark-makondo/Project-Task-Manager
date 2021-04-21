import React, { useReducer } from 'react';
import Context from './Context.js';

// initials states
import AuthInitialStates from './initialStates/AuthInitialStates.js';
import { UserInitialStates, NotifcationsInitialStates } from './initialStates/UserInitialStates.js';
import {
	ProjectInitialStates,
	GetOneProjectStates,
	TaskMessageInitialStates,
	ProjectTasksInitialStates,
	ProjectMembersInitialStates,
} from './initialStates/ProjectInitialStates.js';

// reducers
import AuthReducer from './reducer/AuthReducer.js';
import UserReducer from './reducer/UserReducer.js';
import NotificationReducer from './reducer/NotificationReducer.js';
import ProjectReducer from './reducer/ProjectReducer.js';
import GetOneProjectReducer from './reducer/GetOneProjectReducer.js';
import TaskMessageReducer from './reducer/TaskMessageReducer.js';
import ProjectTaskReducer from './reducer/ProjectTaskReducer.js';
import ProjectMembersReducer from './reducer/ProjectMembersReducer.js';

const AppState = ({ children }) => {
	// user
	const [authState, authDispatch] = useReducer(AuthReducer, AuthInitialStates);
	const [userState, userDispatch] = useReducer(UserReducer, UserInitialStates);

	// user notifications
	const [notificationState, notificationDispatch] = useReducer(NotificationReducer, NotifcationsInitialStates);

	// project
	const [getOneProjectState, getOneProjectDispatch] = useReducer(GetOneProjectReducer, GetOneProjectStates);
	const [projectState, projectDispatch] = useReducer(ProjectReducer, ProjectInitialStates);

	// project tasks
	const [projectTaskState, projectTaskDispatch] = useReducer(ProjectTaskReducer, ProjectTasksInitialStates);
	const [projectMembersState, projectMembersDispatch] = useReducer(ProjectMembersReducer, ProjectMembersInitialStates);

	// project tasks message
	const [taskMessageState, taskMessageDispatch] = useReducer(TaskMessageReducer, TaskMessageInitialStates);

	return (
		<Context.Provider
			value={{
				authState,
				authDispatch,

				userState,
				userDispatch,

				notificationState,
				notificationDispatch,

				getOneProjectState,
				getOneProjectDispatch,

				projectState,
				projectDispatch,

				projectTaskState,
				projectTaskDispatch,

				projectMembersState,
				projectMembersDispatch,

				taskMessageState,
				taskMessageDispatch,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export default AppState;
