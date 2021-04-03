import React from 'react';

// assets
import { ReactComponent as Walking } from '../../../assets/svg/register-bg.svg';

// components
import HomeBackground from '../../homeBackground/HomeBackground.js';

const ProceedForm = ({ formClickhandler, inputChangeHandler }) => {
	let loading = false;
	let error = false;

	return (
		<div className='proceed-form'>
			<HomeBackground />
			<div className='proceed-form-card'>
				<Walking className='proceed-form-card__bg' width='100%' height='85%' />
				<form onSubmit={(e) => formClickhandler(e)}>
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
							name='confirmpassword'
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
							Proceed
						</button>
					)}
				</form>
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

export default ProceedForm;
