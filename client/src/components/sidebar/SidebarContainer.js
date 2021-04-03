import React, { useEffect, useState } from 'react';

// ui
import Sidebar from './Sidebar.js';

// modal components
import ProfileModalContainer from '../modal/profileModal/ProfileContainer.js';
import CreateProjectModalContainer from '../modal/createProjectModal/CreateProjectModalContainer.js';

const SidebarContainer = () => {
	const [isModalProfileActive, setIsModalProfileActive] = useState(false);
	const [isModalCreateProjectActive, setIsModalCreateProjectActive] = useState(
		false
	);

	const collapseClickHandler = (e) => {
		const sidebar = document.querySelector('.sidebar');
		const value = e.target.classList.toggle('rotate');

		if (value) {
			sidebar.classList.add('animate');
		} else {
			sidebar.classList.remove('animate');
		}
	};

	const profileModalClickHandler = () => {
		setIsModalProfileActive(!isModalProfileActive);
	};
	const createProjectModalClickHandler = () => {
		setIsModalCreateProjectActive(!isModalCreateProjectActive);
	};

	useEffect(() => {}, []);
	return (
		<>
			<Sidebar
				collapseClickHandler={collapseClickHandler}
				profileModalClickHandler={profileModalClickHandler}
				createProjectModalClickHandler={createProjectModalClickHandler}
			/>
			<ProfileModalContainer
				isActive={isModalProfileActive}
				setIsActive={setIsModalProfileActive}
			/>
			<CreateProjectModalContainer
				isActive={isModalCreateProjectActive}
				setIsActive={setIsModalCreateProjectActive}
			/>
		</>
	);
};

export default SidebarContainer;
