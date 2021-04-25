import React from 'react';
import GoogleLogin from 'react-google-login';

// config
import { GOOGLE_CLIENT_ID } from '../../../constants/Config.js';

// assets
import { ReactComponent as PersonDoc } from '../../../assets/svg/login.svg';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/google-square.svg';

const LoginForm = ({ formClickhandler, inputChangeHandler, handleGoogleLogin, loading, error }) => {
	if (loading) {
		return <i className='login-loading fas fa-spinner fa-spin'></i>;
	} else {
		return (
			<div className='login-form'>
				<div className='login-form__left'>
					<PersonDoc className='login-form__left-person' width='100%' height='85%' />
				</div>

				<div className='login-form__right'>
					<div className='login-form__right__header'>
						<h1 className='login-form__right__header-title stand-out'>
							Welcome <br /> to Project Task Manager.
						</h1>
						<div className='login-form__right__header-info normal-3'>
							<p>Sign in to get started in managing your project and make your team more productive!</p>
						</div>
					</div>

					<form onSubmit={(e) => formClickhandler(e)}>
						<div className='grouped-input'>
							<input
								id='email'
								onChange={(e) => inputChangeHandler(e)}
								className='normal-3'
								type='email'
								autoComplete='off'
								name='email'
								required
							/>
							<label className='normal-3' htmlFor='email'>
								Email
							</label>
						</div>
						<div className='grouped-input'>
							<input
								id='password'
								onChange={(e) => inputChangeHandler(e)}
								className='normal-3'
								type='password'
								autoComplete='off'
								name='password'
								required
							/>
							<label className='normal-3' htmlFor='password'>
								Password
							</label>
						</div>
						<button className='form-button normal-3' type='submit'>
							Login
						</button>
					</form>

					<span className='login-form__right__or normal-2'>or</span>

					<GoogleLogin
						clientId={GOOGLE_CLIENT_ID}
						render={(renderProps) => (
							<figure
								onClick={renderProps.onClick}
								disabled={renderProps.disabled}
								className='google-button normal-3'
							>
								<GoogleLogo width='1.5rem' height='1.5rem' />
								<figcaption>Signup/login with Google</figcaption>
							</figure>
						)}
						buttonText='Login'
						onSuccess={handleGoogleLogin}
						onFailure={handleGoogleLogin}
						cookiePolicy={'single_host_origin'}
					/>
					{error && (
						<div className='error normal-3'>
							<span>Login Error: </span>
							{error}
						</div>
					)}
				</div>
			</div>
		);
	}
};

export default LoginForm;
