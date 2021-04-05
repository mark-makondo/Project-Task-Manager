import React, { useReducer } from 'react';
import Context from './Context.js';

// initials states
import AuthInitialStates from './initialStates/AuthInitialStates.js';

// reducers
import AuthReducer from './reducer/AuthReducer.js';

const AppState = ({ children }) => {
	const [authState, authDispatch] = useReducer(AuthReducer, AuthInitialStates);

	return (
		<Context.Provider value={{ authState, authDispatch }}>
			{children}
		</Context.Provider>
	);
};

export default AppState;
