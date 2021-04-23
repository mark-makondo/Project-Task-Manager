import React from 'react';

// helper
import { ToggleArrow } from '../../../helper/helperFunctions.js';

// sub components
import CustomButton from './CustomButton.js';

const OverviewHeader = ({ projectCount, ownedProjects, clicked, toggleCollation }) => {
	return (
		<div className='overview-container__header'>
			<h1 className='overview-container__header-title normal-1'>project overview</h1>
			<span className='overview-container__header-projects normal-2 group'>
				You have a total of <span className='highlight'>{projectCount}</span> projects.
			</span>
			<div className='overview-container__header-owned-projects normal-2 group'>
				<div className='divider'>
					You owned <span className='highlight'>{ownedProjects.length}</span> projects.
					<CustomButton
						content={<ToggleArrow click={clicked} name='owned-project' />}
						customClass='normal-3'
						onClick={() => toggleCollation('owned-project')}
					/>
				</div>
				<ul className='owned-projects-list normal-3'>
					{ownedProjects.map((project) =>
						clicked === 'owned-project' ? <li key={project._id}>{project.projectName}</li> : null
					)}
				</ul>
			</div>
		</div>
	);
};

export default OverviewHeader;
