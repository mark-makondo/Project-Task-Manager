import React, { useState } from 'react';

// ui
import UserSettings from './UserSettings.js';

// modal
import ProfileModalContainer from '../../modal/profileModal/ProfileContainer.js';

const UserSettingsContainer = () => {
	const [showProfileModal, setShowProfileModal] = useState(false);

	const showProfileClickHandler = (e) => {
		setShowProfileModal(!showProfileModal);
	};

	return (
		<>
			<UserSettings showProfileClickHandler={showProfileClickHandler} />
			<ProfileModalContainer isActive={showProfileModal} setIsActive={setShowProfileModal} />
		</>
	);
};

export default UserSettingsContainer;
