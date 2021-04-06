import React, { useContext } from 'react';

// helper function
import Query from '../../helper/query.js';
import { dropdownHandler } from '../../helper/helperFunctions.js';

// ui
import Sidebar from './Sidebar.js';

// context actions
import Context from '../../context/Context.js';

const SidebarContainer = () => {
	const {
		userState: {
			user: { data },
		},
	} = useContext(Context);

	/**
	 * Click handler for collapsing the sidebar
	 */
	const collapseClickHandler = (e) => {
		const sidebar = document.querySelector('.sidebar');
		const value = e.target.classList.toggle('rotate');

		if (value) {
			sidebar.classList.add('animate');
		} else {
			sidebar.classList.remove('animate');
		}
	};

	/**
	 * Click handler for showing the dropdown content
	 */
	const showProfileSettingsDropdown = (e) => {
		// query
		const dropdownContentQuery = Query.dropdownProfileSettingsContent();
		const dropdownButtonQuery = Query.dropdownProfileSettingsButton();

		// dropdown helper function
		dropdownHandler(e, dropdownContentQuery, dropdownButtonQuery);
	};

	/**
	 * Click handler for showing the dropdown create project
	 */
	const showCreateProjectDropdown = (e) => {
		// query
		const dropdownContentQuery = Query.dropdownCreateProjectContent();
		const dropdownButtonQuery = Query.dropdownCreateProjectButton();

		// dropdown helper function
		dropdownHandler(e, dropdownContentQuery, dropdownButtonQuery);
	};

	return (
		<>
			<Sidebar
				collapseClickHandler={collapseClickHandler}
				showProfileSettingsDropdown={showProfileSettingsDropdown}
				showCreateProjectDropdown={showCreateProjectDropdown}
				userData={data}
			/>
		</>
	);
};

export default SidebarContainer;
