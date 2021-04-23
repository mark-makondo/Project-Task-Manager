import React from 'react';

// helper
import { getStringInitials } from '../../../helper/helperFunctions.js';

// sub components
import CustomButton from './CustomButton.js';

const ProjectHolder = ({ project, showMembersOnClickHandler, showTasksOnClickHandler }) => {
	return (
		<div className='overview-container__body-project'>
			<div className='overview-container__body-project__title'>{project.projectName}</div>
			<div className='overview-container__body-project__avatar'>
				{project.owner.avatar !== 'no-avatar' ? (
					<img className='normal-3' src={project.owner.avatar} alt='avatar' />
				) : (
					<span>{getStringInitials(project.owner.name)}</span>
				)}
			</div>
			<div className='overview-container__body-project__buttons'>
				<CustomButton
					pid={project._id}
					content='Tasks'
					customClass='overview-container__body-project__buttons-tasks'
					onClick={(e) => showTasksOnClickHandler(e)}
				/>
				<CustomButton
					pid={project._id}
					content='Members'
					customClass='overview-container__body-project__buttons-members'
					onClick={(e) => showMembersOnClickHandler(e)}
				/>
			</div>
		</div>
	);
};

export default ProjectHolder;
