import React from 'react';
import { Link } from 'react-router-dom';
// assets
import { ReactComponent as Sleeping } from '../../../assets/svg/login-bg-svg.svg';

// components
import HomeBackground from '../../homeBackground/HomeBackground.js';

const RegisterForm = ({
	formClickhandler,
	inputChangeHandler,
	loading,
	error,
}) => {
	if (loading) {
		return (
			<div className='register'>
				<HomeBackground />
				<i className='register-loading fas fa-spinner fa-spin'></i>
			</div>
		);
	} else {
		return (
			<div className='register'>
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
								name='name'
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
						<button className='form-button normal-3 button' type='submit'>
							Register
						</button>
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
	}
};

export default RegisterForm;
