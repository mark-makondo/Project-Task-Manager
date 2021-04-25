import React from 'react';

const UserSettings = ({ showProfileClickHandler }) => {
	return (
		<ul className='dropdown-content-profile-settings normal-3'>
			<li onClick={(e) => showProfileClickHandler(e)}>Profile</li>
		</ul>
	);
};

export default UserSettings;
