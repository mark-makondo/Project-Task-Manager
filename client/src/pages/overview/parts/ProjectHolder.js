import React from 'react';

// helper
import { getStringInitials } from '../../../helper/helperFunctions.js';

const ProjectHolder = ({
	project,
	showMembersOnClickHandler,
	showTasksOnClickHandler,
	showUploadedFilesOnClickHandler,
}) => {
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
				<button
					data-pid={project._id}
					onClick={(e) => showTasksOnClickHandler(e)}
					className='overview-container__buttons overview-container__body-project__buttons-tasks'
				>
					<i data-pid={project._id} className='fas fa-thumbtack'></i>
					<span data-pid={project._id}> Tasks</span>
				</button>

				<button
					data-pid={project._id}
					onClick={(e) => showMembersOnClickHandler(e)}
					className='overview-container__buttons overview-container__body-project__buttons-tasks'
				>
					<i data-pid={project._id} className='fas fa-user-friends'></i>
					<span data-pid={project._id}>Members</span>
				</button>

				<button
					data-pid={project._id}
					onClick={(e) => showUploadedFilesOnClickHandler(e)}
					className='overview-container__buttons overview-container__body-project__buttons-tasks'
				>
					<i data-pid={project._id} className='fas fa-archive'></i>
					<span data-pid={project._id}>Files</span>
				</button>
			</div>
		</div>
	);
};

export default ProjectHolder;
