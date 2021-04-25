import React from 'react';

// dropdown
import OwnedProjectsDropdownContainer from '../../../components/dropdown/ownedProjects/OwnedProjectsContainer.js';

const OverviewHeader = ({ projectCount, ownedProjects, showOwnedProjectsDropdown }) => {
	return (
		<div className='overview-container__header'>
			<h1 className='overview-container__header-title normal-1'>project overview</h1>
			<span className='overview-container__header-projects normal-2 group'>
				You have a total of <strong>{projectCount}</strong> projects.
			</span>
			<div
				onClick={(e) => showOwnedProjectsDropdown(e)}
				className='overview-container__header-owned-projects normal-2 group'
			>
				<span>
					You owned <strong>{ownedProjects.length}</strong> projects.
				</span>
				<i className='show-list fas fa-caret-down dropdown-button'></i>

				{ownedProjects && ownedProjects.length !== 0 && (
					<OwnedProjectsDropdownContainer projects={ownedProjects} />
				)}
			</div>
		</div>
	);
};

export default OverviewHeader;
