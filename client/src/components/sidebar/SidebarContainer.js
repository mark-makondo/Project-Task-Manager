import React, { useContext, useState } from 'react';

// helper function
import Query from '../../helper/query.js';
import { dropdownHandler } from '../../helper/helperFunctions.js';

// ui
import Sidebar from './Sidebar.js';

// context actions
import Context from '../../context/Context.js';

const SidebarContainer = () => {
	const [projectClick, setProjectClick] = useState(null);

	const {
		projectState: { project },
	} = useContext(Context);

	const {
		userState: {
			user: { data },
		},
	} = useContext(Context);

	const toggleCollation = (index) => {
		if (projectClick === index) return setProjectClick(null);
		return setProjectClick(index);
	};

	const collapseClickHandler = (e) => {
		const sidebar = document.querySelector('.sidebar');
		const value = e.target.classList.toggle('rotate');

		if (value) {
			sidebar.classList.add('animate');
		} else {
			sidebar.classList.remove('animate');
		}
	};

	const showProfileSettingsDropdown = (e) => {
		const dropdownContentQuery = Query.dropdownProfileSettingsContent();
		const dropdownButtonQuery = Query.dropdownProfileSettingsButton();

		dropdownHandler(e, dropdownContentQuery, dropdownButtonQuery);
	};

	const showCreateProjectDropdown = (e) => {
		const dropdownContentQuery = Query.dropdownCreateProjectContent();
		const dropdownButtonQuery = Query.dropdownCreateProjectButton();

		dropdownHandler(e, dropdownContentQuery, dropdownButtonQuery);
	};

	return (
		<Sidebar
			collapseClickHandler={collapseClickHandler}
			showProfileSettingsDropdown={showProfileSettingsDropdown}
			showCreateProjectDropdown={showCreateProjectDropdown}
			userData={data}
			projects={project}
			toggleCollation={toggleCollation}
			projectClick={projectClick}
		/>
	);
};

export default SidebarContainer;
