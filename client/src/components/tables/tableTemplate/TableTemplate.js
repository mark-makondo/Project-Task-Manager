import React from 'react';
import Moment from 'moment';

// helper functions
import { getStringInitials, getComparedDatePercent, getStatusColor } from '../../../helper/helperFunctions.js';

const TableTitle = ({ project, originalData, dropdownClickHandler, detailsModalClickHandler }) => {
	return (
		<div className='table__title'>
			<div className='table__title-name normal-1'>{project.projectName}</div>
			<div className='table__title-right'>
				<div className='table__title-avatar normal-2'>
					<span>Owner: </span>
					<figure>
						<div className='avatar avatar-global'>
							{originalData.avatar !== 'no-avatar' ? (
								<img className='normal-3' src={originalData.avatar} alt='avatar' />
							) : (
								<span>{getStringInitials(project.owner.name)}</span>
							)}
						</div>
						<figcaption>{originalData.email === project.owner.email ? 'You' : project.owner.name} </figcaption>
					</figure>
				</div>
				<div
					onClick={(e) => dropdownClickHandler(e)}
					className={`dropdown details dropdown-${project.id}`}
					data-id={project.id}
					tabIndex='-1'
				>
					<i className={`fas fa-ellipsis-v normal-1 dropdown-button dropdown-button-${project.id}`}></i>
					<div className={`dropdown-content dropdown-content-${project.id}`}>
						<span onClick={(e) => detailsModalClickHandler(e)}>Details</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const TableHeader = () => {
	return (
		<div className='table__content-th table__content--grid'>
			<span>task name</span>
			<span>person</span>
			<span>status</span>
			<span>deadline</span>
		</div>
	);
};

const TableRow = ({ task, messageClickHandler }) => {
	let calculatedDatePercent = `${getComparedDatePercent(task.created_at, task.deadline)}%`;
	let getCurrentStatusColor = getStatusColor(task.status);

	return (
		<div className='table__content-tr table__content--grid'>
			<div className='table__content-tr__task cell'>
				<div style={{ backgroundColor: getCurrentStatusColor }} className='indicator'></div>
				<div className='content-wrapper'>
					<span className='content' title={task.taskName}>
						{task.taskName}
					</span>
				</div>

				<i onClick={messageClickHandler} className='message-dot far fa-comment-dots'></i>
			</div>
			<div className='table__content-tr__avatar cell'>
				<div className='avatar avatar-global'>
					{!!task.assigned ? (
						task.assigned.avatar !== 'no-avatar' ? (
							<img src={task.assigned.avatar} alt='avatar' />
						) : (
							<span>{getStringInitials(task.assigned.name)}</span>
						)
					) : (
						''
					)}
				</div>
			</div>
			<div className='table__content-tr__status cell'>
				<span style={{ backgroundColor: getCurrentStatusColor }}>{task.status}</span>
			</div>
			<div className='table__content-tr__deadline cell'>
				<div style={{ width: calculatedDatePercent }} className='deadline-progress'></div>
				<span>{task.deadline !== '' && Moment.utc(task.deadline, 'MM DD YYY').format('MMM Do YY')}</span>
			</div>
		</div>
	);
};

/**
 * Main Component of TableOverview
 * TableHolder
 *
 * @param {*} props
 * @returns
 */
const TableTemplate = ({
	project,
	originalData,
	messageClickHandler,
	dropdownClickHandler,
	detailsModalClickHandler,
}) => {
	return (
		<div className='table'>
			<TableTitle
				originalData={originalData}
				project={project}
				dropdownClickHandler={dropdownClickHandler}
				detailsModalClickHandler={detailsModalClickHandler}
			/>
			<div className='table__content normal-2'>
				<TableHeader />
				{project.tasks.map((task) => (
					<TableRow key={`pr-${task._id}`} task={task} messageClickHandler={messageClickHandler} />
				))}
			</div>
		</div>
	);
};

export default TableTemplate;
