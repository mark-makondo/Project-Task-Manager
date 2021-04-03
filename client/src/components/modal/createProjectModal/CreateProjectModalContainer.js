import React, { useEffect } from 'react';

// ui
import CreateProjectModal from './CreateProjectModal.js';

const CreateProjectModalContainer = ({ isActive, setIsActive }) => {
	useEffect(() => {
		let createProjectModalQuery = document.querySelector(
			'.create-project-modal'
		);

		if (createProjectModalQuery) {
			if (isActive) {
				createProjectModalQuery.classList.add('active');
			} else {
				createProjectModalQuery.classList.remove('active');
			}

			createProjectModalQuery.addEventListener('click', (e) => {
				if (e.target === createProjectModalQuery) {
					setIsActive(false);
				}
			});
		}
	}, [isActive, setIsActive]);

	return <CreateProjectModal />;
};

export default CreateProjectModalContainer;
