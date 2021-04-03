import React from 'react';

const ProfileModal = ({ formSubmitHandler }) => {
	let isLoading = false;
	let error = false;

	return (
		<div className='profile-modal'>
			<div className='profile-modal__wrapper'>
				<form onSubmit={formSubmitHandler}>
					<div>
						<input
							id='firstName'
							className='normal-1'
							type='text'
							autoComplete='off'
							name='firstName'
							required
						/>
						<label className='normal-1' htmlFor='firstName'>
							First Name
						</label>
					</div>
					<div>
						<input
							id='lastName'
							className='normal-1'
							type='text'
							autoComplete='off'
							name='lastName'
							required
						/>
						<label className='normal-1' htmlFor='lastName'>
							Last Name
						</label>
					</div>
					<div>
						<input
							id='email'
							className='normal-1'
							type='email'
							autoComplete='off'
							name='email'
							required
						/>
						<label className='normal-1' htmlFor='email'>
							Email
						</label>
					</div>
					{error ? <span className='error'>{error}</span> : ''}

					{isLoading ? (
						<i className='fas fa-spinner fa-spin'></i>
					) : (
						<button className='normal-1' type='submit'>
							update
						</button>
					)}
				</form>
			</div>
		</div>
	);
};

export default ProfileModal;
