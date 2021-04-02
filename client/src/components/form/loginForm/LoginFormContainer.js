import React from 'react';

// ui
import LoginForm from './LoginForm.js';

const LoginFormContainer = () => {
	const formClickhandler = (e) => {
		e.preventDefault();
	};

	const inputChangeHandler = () => {};

	return (
		<>
			<LoginForm
				formClickhandler={formClickhandler}
				inputChangeHandler={inputChangeHandler}
			/>
		</>
	);
};

export default LoginFormContainer;
