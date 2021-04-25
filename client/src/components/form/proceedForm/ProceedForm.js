import React from 'react';

// assets
import { ReactComponent as Person } from '../../../assets/svg/proceed.svg';

// components
import HomeBackground from '../../homeBackground/HomeBackground.js';

const ProceedForm = ({ formClickhandler, inputChangeHandler, loading, error }) => {
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
					<div className='proceed-form-card__left'>
						<Person className='proceed-form-card__left-person' width='100%' height='85%' />
					</div>

					<div className='proceed-form-card__right'>
						<div className='proceed-form-card__right__header'>
							<h1 className='proceed-form-card__right__header-title stand-out'>Almost there.</h1>
							<div className='proceed-form-card__right__header-info normal-3'>
								<p>Fill up the form to register.</p>
							</div>
						</div>

						<form onSubmit={(e) => formClickhandler(e)}>
							<div className='grouped-input'>
								<input
									id='fullname'
									onChange={(e) => inputChangeHandler(e)}
									className='normal-3'
									type='text'
									autoComplete='new-password'
									name='name'
									required
								/>
								<label className='normal-3' htmlFor='email'>
									Full Name
								</label>
							</div>
							<div className='grouped-input'>
								<input
									id='password'
									onChange={(e) => inputChangeHandler(e)}
									className='normal-3'
									type='password'
									autoComplete='new-password'
									name='password'
									required
								/>
								<label className='normal-3' htmlFor='password'>
									Password
								</label>
							</div>
							<button className='form-button normal-3 button' type='submit'>
								Proceed
							</button>
						</form>
					</div>

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

export default ProceedForm;
