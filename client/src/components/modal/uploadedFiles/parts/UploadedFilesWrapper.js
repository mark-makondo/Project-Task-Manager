import React from 'react';

// assets
import { ReactComponent as EmptyTask } from '../../../../assets/svg/empty-task.svg';

// sub components
import TaskLists from './TaskLists.js';

const UploadedFilesWrapper = ({
	projectName,
	styleForLoading,
	isLoading,
	projectTasks,
	toggleCollation,
	clicked,
}) => {
	return (
		<div className='uploaded-files-modal-wrapper'>
			<div className='overview-members-modal-header'>
				<div className='uploaded-files-modal-header__title'>
					<i className='fas fa-archive'></i>
					<span className='normal-1'> uploaded files</span>
				</div>
				<span className='uploaded-files-modal-header__projectname normal-2'>{projectName}</span>
			</div>

			<div style={styleForLoading} className='uploaded-files-modal-body normal-3'>
				{!isLoading ? (
					projectTasks && projectTasks?.length !== 0 ? (
						<TaskLists toggleCollation={toggleCollation} clicked={clicked} projectTasks={projectTasks} />
					) : (
						<EmptyTask className='empty-task-bg' />
					)
				) : (
					<i className='uploaded-files-modal-loading fas fa-spinner fa-spin'></i>
				)}
			</div>
		</div>
	);
};

export default UploadedFilesWrapper;
