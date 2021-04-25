import React from 'react';

const ProfileChangePassword = ({
	isLoading,
	changePassSubmitHandler,
	inputOnChangeHandler,
	isChangingPassword,
	input,
}) => {
	return (
		<form
			className='profile-modal__wrapper-body__change-password normal-3'
			onSubmit={(e) => changePassSubmitHandler(e)}
		>
			<div className='profile-modal__wrapper-body__change-password__current'>
				<label className={`${!isChangingPassword && 'disabled'}`} htmlFor='currentPassword'>
					Current Password:
				</label>

				<input
					id='currentPassword'
					className='normal-3'
					type='password'
					autoComplete='off'
					onChange={(e) => inputOnChangeHandler(e)}
					name='currentPassword'
					value={input.currentPassword}
					disabled={!isChangingPassword && 'disabled'}
					required
				/>
			</div>
			<div className='profile-modal__wrapper-body__change-password__new'>
				<label className={`${!isChangingPassword && 'disabled'}`} htmlFor='newPassword'>
					New Password:
				</label>
				<input
					id='newPassword'
					className='normal-3'
					type='password'
					autoComplete='off'
					onChange={(e) => inputOnChangeHandler(e)}
					name='newPassword'
					value={input.newPassword}
					disabled={!isChangingPassword && 'disabled'}
					required
				/>
			</div>

			{isLoading ? (
				<i className='profile-modal-loading fas fa-spinner fa-spin'></i>
			) : (
				<button className='normal-4 active' type='submit' disabled={!isChangingPassword && 'disabled'}>
					Update Password
				</button>
			)}
		</form>
	);
};

export default ProfileChangePassword;
