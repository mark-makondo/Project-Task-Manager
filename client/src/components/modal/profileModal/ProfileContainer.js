import React, { useEffect } from 'react';
import ProfileModal from './ProfileModal.js';

const ProfileModalContainer = ({ isActive, setIsActive }) => {
	useEffect(() => {
		let profileModalQuery = document.querySelector('.profile-modal');

		if (profileModalQuery) {
			if (isActive) {
				profileModalQuery.classList.add('active');
			} else {
				profileModalQuery.classList.remove('active');
			}

			profileModalQuery.addEventListener('click', (e) => {
				if (e.target === profileModalQuery) {
					setIsActive(false);
				}
			});
		}
	}, [isActive, setIsActive]);

	return <ProfileModal />;
};

export default ProfileModalContainer;
