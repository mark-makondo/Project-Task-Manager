import React from 'react';

// helper
import { getStringInitials } from '../../../../helper/helperFunctions';

const ProfileHeader = ({ user }) => {
	return (
		<div className='profile-modal__wrapper-header'>
			<div className='profile-modal__wrapper-header__avatar'>
				{user && user.avatar !== 'no-avatar' ? (
					<img className='normal-3' src={user.avatar} alt='avatar' />
				) : (
					<span>{getStringInitials(user.name)}</span>
				)}
			</div>
		</div>
	);
};

export default ProfileHeader;
