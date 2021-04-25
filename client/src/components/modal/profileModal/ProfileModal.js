import React from 'react';

// parts
import ProfileHeader from './parts/ProfileHeader.js';
import ProfileInfo from './parts/ProfileInfo.js';
import ProfileChangePassword from './parts/ProfileChangePassword.js';

const ProfileModal = ({
	user,
	input,
	error,
	isLoading,
	changePassSubmitHandler,
	nameSaveClickHandler,
	inputOnChangeHandler,
	isEditable,
	setIsEditable,
	isChangingPassword,
	setIsChangingPassword,
}) => {
	return (
		<div className='profile-modal'>
			<div className='profile-modal__wrapper'>
				<ProfileHeader user={user} />

				<div className='profile-modal__wrapper-body normal-3'>
					<ProfileInfo
						user={user}
						input={input}
						nameSaveClickHandler={nameSaveClickHandler}
						inputOnChangeHandler={inputOnChangeHandler}
						isEditable={isEditable}
						setIsEditable={setIsEditable}
						isChangingPassword={isChangingPassword}
						setIsChangingPassword={setIsChangingPassword}
					/>
					<ProfileChangePassword
						isLoading={isLoading}
						changePassSubmitHandler={changePassSubmitHandler}
						inputOnChangeHandler={inputOnChangeHandler}
						isChangingPassword={isChangingPassword}
						setIsChangingPassword={setIsChangingPassword}
						input={input}
					/>
					{error && <span className='error normal-3'>{error}</span>}
				</div>
			</div>
		</div>
	);
};

export default ProfileModal;
