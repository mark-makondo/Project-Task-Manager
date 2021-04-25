import React from 'react';

const ProfileInfo = ({
	user,
	input,
	nameSaveClickHandler,
	inputOnChangeHandler,
	isEditable,
	setIsEditable,
	setIsChangingPassword,
	isChangingPassword,
}) => {
	return (
		<div className='profile-modal__wrapper-body__info'>
			<div className={`profile-modal__wrapper-body__info-name group-set ${isEditable && 'editable'}`}>
				<div className='input-group'>
					<span>{user && user.name}</span>
					<input
						id='name'
						className='normal-3'
						type='text'
						autoComplete='off'
						name='name'
						value={input && input.name}
						onChange={(e) => inputOnChangeHandler(e)}
					/>
				</div>
				<div className='input-icons'>
					<i onClick={() => setIsEditable(true)} className='edit fas fa-edit'></i>
					<i onClick={() => setIsEditable(false)} className='cancel fas fa-times'></i>
					<i onClick={(e) => nameSaveClickHandler(e)} className=' save fas fa-check'></i>
				</div>
			</div>

			<span className='profile-modal__wrapper-body__info-loggedinas'>
				Logged in as <strong>{user.email}</strong>
			</span>

			<div className={`profile-modal__wrapper-body__info-password ${isChangingPassword && 'editable'}`}>
				<div className='input-group'>
					<label htmlFor='password'>Password:</label>
					<input
						id='password'
						className='normal-3'
						type='password'
						readOnly
						defaultValue={user && user.password.substr(0, 15)}
					/>
				</div>
				<div className='input-icons'>
					<i onClick={() => setIsChangingPassword(true)} className='edit fas fa-edit'></i>
					<i onClick={() => setIsChangingPassword(false)} className='cancel fas fa-times'></i>
				</div>
			</div>
		</div>
	);
};

export default ProfileInfo;
