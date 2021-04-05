import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';

// helper function
import { decodedJwt } from '../../../helper/helperFunctions.js';

// ui
import ProceedForm from './ProceedForm.js';

// context actions
import Context from '../../../context/Context.js';
import { RegisterAction } from '../../../context/actions/auth/RegisterAction.js';

const ProceedFormContainer = () => {
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
			email: user.email,
			avatar: user.avatar,
			path: 'google-proceed',
			[e.target.name]: e.target.value,
		});
	};

	// if no user found in the state redirect to home
	if (!user) return <Redirect to='/' />;

	if (decodedJwt().isValid) {
		return <Redirect to={`/${decodedJwt().result._id}/dashboard`} />;
	}
	return (
		<>
			<ProceedForm
				formClickhandler={formClickhandler}
				inputChangeHandler={inputChangeHandler}
				loading={loading}
				error={error}
			/>
		</>
	);
};

export default ProceedFormContainer;
