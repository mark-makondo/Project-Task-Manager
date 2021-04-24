import React from 'react';

const OwnedProjects = ({ projects }) => {
	return (
		<div className='dropdown-content-owned-projects normal-3'>
			<div className='dropdown-content-owned-projects-wrapper'>
				<ul>
					{projects.map((project) => (
						<li key={project._id}>
							<span title={project.projectName}>{project.projectName}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default OwnedProjects;
