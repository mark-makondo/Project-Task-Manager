import React from 'react';

// sub components
import OverviewHeader from './parts/OverviewHeader.js';
import ProjectHolder from './parts/ProjectHolder.js';

const Overview = ({
	data,
	projectCount,
	ownedProjects,
	showMembersOnClickHandler,
	showTasksOnClickHandler,
	showUploadedFilesOnClickHandler,
	showOwnedProjectsDropdown,
}) => {
	return (
		<div className='overview'>
			<div className='overview-container'>
				<OverviewHeader
					data={data}
					projectCount={projectCount}
					ownedProjects={ownedProjects}
					showOwnedProjectsDropdown={showOwnedProjectsDropdown}
				/>

				<div className='overview-container__body'>
					{data.length !== 0 &&
						data.map((project, i) => (
							<ProjectHolder
								key={`${project._id}-${i}`}
								project={project}
								showMembersOnClickHandler={showMembersOnClickHandler}
								showTasksOnClickHandler={showTasksOnClickHandler}
								showUploadedFilesOnClickHandler={showUploadedFilesOnClickHandler}
							/>
						))}
				</div>
			</div>
		</div>
	);
};

export default Overview;
