import React from 'react';

// assets
import { ReactComponent as Sleeping } from '../../../assets/svg/login-bg-svg.svg';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/google-square.svg';

const LoginForm = ({ formClickhandler, inputChangeHandler }) => {
	let loading = false;
	let error = false;

	return (
		<div className='login-form normal-1'>
			<Sleeping className='login-form__bg' width='100%' height='85%' />
			<figure className='google-button normal-3 button'>
				<GoogleLogo width='1.5rem' height='1.5rem' />

				<figcaption> Login with Google</figcaption>
			</figure>

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
				{loading ? (
					<i class='fas fa-spinner fa-spin'></i>
				) : (
					<button className='form-button normal-3 button' type='submit'>
						Login
					</button>
				)}
			</form>
			{error ? <span className='error'>{error}</span> : ''}
		</div>
	);
};

export default LoginForm;
