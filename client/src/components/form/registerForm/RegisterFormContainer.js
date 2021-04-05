import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';

// ui
import RegisterForm from './RegisterForm.js';

// context actions
import Context from '../../../context/Context.js';
import { RegisterAction } from '../../../context/actions/auth/RegisterAction.js';

const RegisterFormContainer = () => {
	const [input, setInput] = useState({
		email: '',
		name: '',
		password: '',
	});

	const {
		authState: {
			auth: { loading, error, user },
		},
		authDispatch,
	} = useContext(Context);

	const formClickhandler = (e) => {
		e.preventDefault();

		RegisterAction(input)(authDispatch);
	};
	const inputChangeHandler = (e) => {
		setInput({
			...input,
			path: 'register',
			[e.target.name]: e.target.value,
		});
	};

	if (!!user) return <Redirect to='/' />;

	return (
		<RegisterForm
			formClickhandler={formClickhandler}
			inputChangeHandler={inputChangeHandler}
			loading={loading}
			error={error}
		/>
	);
};

export default RegisterFormContainer;