import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';

// helper function
import { decodedJwt } from '../../../helper/helperFunctions.js';

// ui
import LoginForm from './LoginForm.js';

// context actions
import Context from '../../../context/Context.js';
import { LoginAction } from '../../../context/actions/auth/LoginAction.js';

const LoginFormContainer = () => {
	const [input, setInput] = useState({
		email: '',
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

		LoginAction({ input, path: 'login' })(authDispatch);
	};

	const inputChangeHandler = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	};

	const handleGoogleLogin = (response) => {
		LoginAction({ response, path: 'google-proceed' })(authDispatch);
		if (response.error) {
			// just to check if an error occured, i will not handle it since i like it when
			// it shows the failed google login error on the back end
			console.error(response.error);
		}
	};

	/**
	 * determines if the user google email does not exist in the database
	 * and redirect to no-user-found/register if true.
	 */
	if (user?.redirect) {
		return <Redirect to={user.redirect} />;
	}

	if (decodedJwt().isValid) {
		return <Redirect to={`/${decodedJwt().result._id}/dashboard`} />;
	}
	return (
		<LoginForm
			formClickhandler={formClickhandler}
			inputChangeHandler={inputChangeHandler}
			handleGoogleLogin={handleGoogleLogin}
			loading={loading}
			error={error}
		/>
	);
};

export default LoginFormContainer;
