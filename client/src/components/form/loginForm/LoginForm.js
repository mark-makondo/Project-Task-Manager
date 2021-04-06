import React from 'react';
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';

// assets
import { ReactComponent as Sleeping } from '../../../assets/svg/login-bg-svg.svg';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/google-square.svg';

const LoginForm = ({
	formClickhandler,
	inputChangeHandler,
	handleGoogleLogin,
	loading,
	error,
}) => {
	const clientId =
		'934331962195-0k9qksgpq7j703f84o6ocf6t0unps4ll.apps.googleusercontent.com';

	if (loading) {
		return <i className='login-loading fas fa-spinner fa-spin'></i>;
	} else {
		return (
			<div className='login-form'>
				<Sleeping className='login-form__bg' width='100%' height='85%' />

				<GoogleLogin
					clientId={clientId}
					render={(renderProps) => (
						<figure
							onClick={renderProps.onClick}
							disabled={renderProps.disabled}
							className='google-button normal-3'
						>
							<GoogleLogo width='1.5rem' height='1.5rem' />
							<figcaption> Login with Google</figcaption>
						</figure>
					)}
					buttonText='Login'
					onSuccess={handleGoogleLogin}
					onFailure={handleGoogleLogin}
					cookiePolicy={'single_host_origin'}
				/>

				<form onSubmit={(e) => formClickhandler(e)}>
					<div className='grouped-input'>
						<input
							id='email'
							onChange={(e) => inputChangeHandler(e)}
							className='normal-2'
							type='email'
							autoComplete='off'
							name='email'
							required
						/>
						<label className='normal-1' htmlFor='email'>
							Email
						</label>
					</div>
					<div className='grouped-input'>
						<input
							id='password'
							onChange={(e) => inputChangeHandler(e)}
							className='normal-2'
							type='password'
							autoComplete='off'
							name='password'
							required
						/>
						<label className='normal-1' htmlFor='password'>
							Password
						</label>
					</div>
					<button className='form-button normal-3' type='submit'>
						Login
					</button>
				</form>

				<Link to='/register' className='login-form__gotoreg normal-2'>
					Don't have an account yet?
				</Link>

				{error ? (
					<div className='error normal-2'>
						<span>Login Error: </span>
						{error}
					</div>
				) : (
					''
				)}
			</div>
		);
	}
};

export default LoginForm;
