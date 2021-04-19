import React, { useReducer } from 'react';
import Context from './Context.js';

// initials states
import AuthInitialStates from './initialStates/AuthInitialStates.js';
import UserInitialStates from './initialStates/UserInitialStates.js';
import {
	ProjectInitialStates,
	GetOneProjectStates,
	TaskMessageInitialStates,
	MembersInitialStates,
	// test
	ProjectTasksInitialStates,
} from './initialStates/ProjectInitialStates.js';

// reducers
import AuthReducer from './reducer/AuthReducer.js';
import UserReducer from './reducer/UserReducer.js';
import ProjectReducer from './reducer/ProjectReducer.js';
import GetOneProjectReducer from './reducer/GetOneProjectReducer.js';
import TaskMessageReducer from './reducer/TaskMessageReducer.js';
import MembersReducer from './reducer/MembersReducer.js';

//test
import ProjectTaskReducer from './reducer/ProjectTaskReducer.js';

const AppState = ({ children }) => {
	const [authState, authDispatch] = useReducer(AuthReducer, AuthInitialStates);
	const [userState, userDispatch] = useReducer(UserReducer, UserInitialStates);
	const [projectState, projectDispatch] = useReducer(ProjectReducer, ProjectInitialStates);
	const [getOneProjectState, getOneProjectDispatch] = useReducer(GetOneProjectReducer, GetOneProjectStates);
	const [taskMessageState, taskMessageDispatch] = useReducer(TaskMessageReducer, TaskMessageInitialStates);
	const [membersState, membersDispatch] = useReducer(MembersReducer, MembersInitialStates);

	// testing table reducer
	const [projectTaskState, projectTaskDispatch] = useReducer(ProjectTaskReducer, ProjectTasksInitialStates);

	return (
		<Context.Provider
			value={{
				authState,
				authDispatch,

				userState,
				userDispatch,

				projectState,
				projectDispatch,

				getOneProjectState,
				getOneProjectDispatch,

				taskMessageState,
				taskMessageDispatch,

				membersState,
				membersDispatch,

				// test
				projectTaskState,
				projectTaskDispatch,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export default AppState;
