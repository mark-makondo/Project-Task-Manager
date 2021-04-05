import React from 'react';

// assets
import { ReactComponent as Walking } from '../../../assets/svg/register-bg.svg';

// components
import HomeBackground from '../../homeBackground/HomeBackground.js';

const ProceedForm = ({
	formClickhandler,
	inputChangeHandler,
	loading,
	error,
}) => {
	if (loading) {
		return (
			<div className='proceed'>
				<HomeBackground />
				<i className='proceed-loading fas fa-spinner fa-spin'></i>;
			</div>
		);
	} else {
		return (
			<div className='proceed'>
				<HomeBackground />
				<div className='proceed-form-card'>
					<Walking
						className='proceed-form-card__bg'
						width='100%'
						height='85%'
					/>
					<form onSubmit={(e) => formClickhandler(e)}>
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
							Proceed
						</button>
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
	}
};

export default ProceedForm;
