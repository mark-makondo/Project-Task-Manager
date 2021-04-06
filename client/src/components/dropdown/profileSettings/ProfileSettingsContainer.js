import React from 'react';

// ui
import ProfileSettings from './ProfileSettings.js';

const ProfileSettingsContainer = () => {
	const showProfileClickHandler = (e) => {
		// console.log(e.currentTarget);
	};

	const changePasswordClickHandler = (e) => {
		// console.log(e.currentTarget);
	};

	return (
		<ProfileSettings
			showProfileClickHandler={showProfileClickHandler}
			changePasswordClickHandler={changePasswordClickHandler}
		/>
	);
};

export default ProfileSettingsContainer;
