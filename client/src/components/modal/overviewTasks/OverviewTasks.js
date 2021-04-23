import React from 'react';
import Moment from 'moment';

// assets
import { ReactComponent as EmptyTask } from '../../../assets/svg/empty-task.svg';

// helper
import { getStringInitials, getComparedDatePercent } from '../../../helper/helperFunctions.js';
import { ToggleArrow } from '../../../helper/helperFunctions.js';

const TaskTitle = ({ projectOwnerAvatar, projectOwnerName, projectCreated }) => {
	let formattedDate = Moment(projectCreated).format('MMMM Do YYYY');

	return (
		<div className='overview-tasks-modal-body__title'>
			<div className='overview-tasks-modal-body__title-avatar'>
				{projectOwnerAvatar !== 'no-avatar' ? (
					<img className='normal-3' src={projectOwnerAvatar} alt='avatar' />
				) : (
					<span>{getStringInitials(projectOwnerName)}</span>
				)}
			</div>
			<div className='overview-tasks-modal-body__title-info'>
				<span>
					<strong>{projectOwnerName}</strong> created the project at
					<strong> {formattedDate}</strong>.
				</span>
			</div>
		</div>
	);
};

const TaskStatusHolder = ({ toggleCollation, clicked, indexName, lists }) => {
	if (indexName === '') indexName = 'empty';

	return (
		<section className={`overview-tasks-modal-body__status-${indexName}`}>
			<div onClick={() => toggleCollation(indexName)} className='status-info'>
				<span>
					<strong>{indexName}</strong> status - <strong>{lists && lists.length} </strong>
				</span>
				<ToggleArrow click={clicked} name={indexName} />
			</div>
			<ul className='status-task-list'>
				{lists &&
					lists.length !== 0 &&
					lists.map((task) =>
						clicked === indexName ? (
							<li key={task._id}>
								<div className='status-task-list__avatar'>
									{!!task.assigned && task.assigned.avatar !== 'no-avatar' ? (
										<img className='normal-3' src={task.assigned.avatar} alt='avatar' />
									) : (
										<span title={task.assigned.name}>{getStringInitials(task.assigned.name)}</span>
									)}
								</div>
								<span className='status-task-list__taskname' title={task.taskName}>
									{task.taskName}
								</span>
								<div className='status-task-list__deadline'>
									<div
										style={{ width: `${getComparedDatePercent(task.created_at, task.deadline)}%` }}
										className='status-task-list__deadline-indicator'
									></div>
									<span title={task.deadline} className='status-task-list__deadline-value'>
										{task.deadline ? Moment(task.deadline).format('MMMM Do YYYY') : 'No Deadline'}
									</span>
								</div>
							</li>
						) : null
					)}
			</ul>
		</section>
	);
};

const TaskStatus = ({ completedStatus, workingStatus, stuckStatus, emptyStatus, toggleCollation, clicked }) => {
	let statusNames = ['completed', 'working', 'stuck', ''];

	return (
		<div className='overview-tasks-modal-body__status'>
			{statusNames.map((name, i) => (
				<TaskStatusHolder
					key={`${name}-${i}`}
					toggleCollation={toggleCollation}
					clicked={clicked}
					indexName={name}
					lists={
						name === 'completed'
							? completedStatus
							: name === 'working'
							? workingStatus
							: name === 'stuck'
							? stuckStatus
							: name === ''
							? emptyStatus
							: null
					}
				/>
			))}
		</div>
	);
};

/**
 * Main component modal tasks.
 */
const OverviewTasks = ({
	data,
	isLoading,
	completedStatus,
	workingStatus,
	stuckStatus,
	emptyStatus,
	toggleCollation,
	clicked,
}) => {
	let isProject = data && data.project;
	let projectTasks = isProject?.tasks;
	let projectName = isProject?.projectName;
	let projectOwnerName = isProject?.owner.name;
	let projectCreated = isProject?.createdAt;
	let projectOwnerAvatar = isProject?.owner.avatar;

	let styleForLoading = {
		overflow: `${isLoading ? 'hidden' : ''}`,
	};

	return (
		<div className='overview-tasks-modal'>
			<div className='overview-tasks-modal-wrapper'>
				<div className='overview-tasks-modal-header'>
					<div className='overview-tasks-modal-header__title'>
						<i className='fas fa-thumbtack'></i>
						<span className='normal-1'> project tasks</span>
					</div>
					<span className='overview-tasks-modal-header__projectname normal-2'>{projectName}</span>
				</div>

				<div style={styleForLoading} className='overview-tasks-modal-body normal-3'>
					{!isLoading ? (
						projectTasks && projectTasks?.length !== 0 ? (
							<>
								<TaskTitle
									projectOwnerAvatar={projectOwnerAvatar}
									projectOwnerName={projectOwnerName}
									projectCreated={projectCreated}
								/>

								<TaskStatus
									completedStatus={completedStatus}
									workingStatus={workingStatus}
									stuckStatus={stuckStatus}
									emptyStatus={emptyStatus}
									toggleCollation={toggleCollation}
									clicked={clicked}
								/>
							</>
						) : (
							<EmptyTask className='empty-task-bg' />
						)
					) : (
						<i className='overview-tasks-modal-loading fas fa-spinner fa-spin'></i>
					)}
				</div>
			</div>
		</div>
	);
};

export default OverviewTasks;
