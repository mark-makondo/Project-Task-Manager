import React from 'react';
import { Link } from 'react-router-dom';
// assets
import { ReactComponent as Sleeping } from '../../../assets/svg/login-bg-svg.svg';

// components
import HomeBackground from '../../homeBackground/HomeBackground.js';

const RegisterForm = ({ formClickhandler, inputChangeHandler }) => {
	let loading = false;
	let error = false;

	return (
		<div className='register-form'>
			<HomeBackground />
			<div className='register-form-card'>
				<Sleeping
					className='register-form-card__bg'
					width='100%'
					height='85%'
				/>
				<form onSubmit={(e) => formClickhandler(e)}>
					<div className='grouped-input'>
						<input
							id='email'
							onChange={(e) => inputChangeHandler(e)}
							className='normal-2'
							type='email'
							autoComplete='new-password'
							name='email'
							required
						/>
						<label className='normal-1' htmlFor='email'>
							Email
						</label>
					</div>
					<div className='grouped-input'>
						<input
							id='fullname'
							onChange={(e) => inputChangeHandler(e)}
							className='normal-2'
							type='text'
							autoComplete='new-password'
							name='fullname'
							required
						/>
						<label className='normal-1' htmlFor='email'>
							Full Name
						</label>
					</div>
					<div className='grouped-input'>
						<input
							id='password'
							onChange={(e) => inputChangeHandler(e)}
							className='normal-2'
							type='password'
							autoComplete='new-password'
							name='password'
							required
						/>
						<label className='normal-1' htmlFor='password'>
							Password
						</label>
					</div>
					<div className='grouped-input'>
						<input
							id='confirmpassword'
							onChange={(e) => inputChangeHandler(e)}
							className='normal-2'
							type='password'
							autoComplete='new-password'
							name='confirmPassword'
							required
						/>
						<label className='normal-1' htmlFor='password'>
							Confirm Password
						</label>
					</div>
					{loading ? (
						<i class='fas fa-spinner fa-spin'></i>
					) : (
						<button className='form-button normal-3 button' type='submit'>
							Register
						</button>
					)}
				</form>
				<Link to='/' className='register-form-card__gotologin normal-2'>
					Already have an account?
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
		</div>
	);
};

export default RegisterForm;
