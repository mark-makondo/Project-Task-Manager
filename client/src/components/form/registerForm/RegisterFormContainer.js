import React from 'react';

// ui
import RegisterForm from './RegisterForm.js';

const RegisterFormContainer = () => {
	const formClickhandler = () => {};
	const inputChangeHandler = () => {};
	return (
		<>
			<RegisterForm
				formClickhandler={formClickhandler}
				inputChangeHandler={inputChangeHandler}
			/>
		</>
	);
};

export default RegisterFormContainer;
