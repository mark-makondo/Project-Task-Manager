import React, { useReducer } from 'react';
import Context from './Context.js';

// initials states
import AuthInitialStates from './initialStates/AuthInitialStates.js';
import UserInitialStates from './initialStates/UserInitialStates.js';
import { ProjectInitialStates, GetOneProjectStates } from './initialStates/ProjectInitialStates.js';

// reducers
import AuthReducer from './reducer/AuthReducer.js';
import UserReducer from './reducer/UserReducer.js';
import ProjectReducer from './reducer/ProjectReducer.js';
import GetOneProjectReducer from './reducer/GetOneProjectReducer.js';

const AppState = ({ children }) => {
	const [authState, authDispatch] = useReducer(AuthReducer, AuthInitialStates);
	const [userState, userDispatch] = useReducer(UserReducer, UserInitialStates);
	const [projectState, projectDispatch] = useReducer(ProjectReducer, ProjectInitialStates);
	const [getOneProjectState, getOneProjectDispatch] = useReducer(GetOneProjectReducer, GetOneProjectStates);

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
			}}
		>
			{children}
		</Context.Provider>
	);
};

export default AppState;
