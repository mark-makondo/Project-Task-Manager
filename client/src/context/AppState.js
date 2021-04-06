import React, { useReducer } from 'react';
import Context from './Context.js';

// initials states
import AuthInitialStates from './initialStates/AuthInitialStates.js';
import UserInitialStates from './initialStates/UserInitialStates.js';

// reducers
import AuthReducer from './reducer/AuthReducer.js';
import UserReducer from './reducer/UserReducer.js';

const AppState = ({ children }) => {
	const [authState, authDispatch] = useReducer(AuthReducer, AuthInitialStates);
	const [userState, userDispatch] = useReducer(UserReducer, UserInitialStates);

	return (
		<Context.Provider
			value={{
				authState,
				authDispatch,

				userState,
				userDispatch,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export default AppState;
