import React from 'react';

const ProfileSettings = ({
	showProfileClickHandler,
	changePasswordClickHandler,
}) => {
	return (
		<ul className='dropdown-content-profile-settings normal-2'>
			<li onClick={(e) => showProfileClickHandler(e)}>Profile</li>
			<li onClick={(e) => changePasswordClickHandler(e)}>Change Password</li>
		</ul>
	);
};

export default ProfileSettings;
