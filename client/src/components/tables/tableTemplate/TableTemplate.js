import React from 'react';
import Moment from 'moment';

// helper functions
import {
	getStringInitials,
	getComparedDatePercent,
	getStatusColor,
} from '../../../helper/helperFunctions.js';

const TableTitle = ({
	project,
	img,
	dropdownClickHandler,
	detailsModalClickHandler,
}) => {
	return (
		<div className='table__title '>
			<div className='table__title-name normal-1'>{project.projectName}</div>
			<div className='table__title-right'>
				<div className='table__title-avatar normal-2'>
					<span>Owner: </span>
					<figure>
						<div className='avatar avatar-global'>
							{img ? (
								<img src='' alt='' />
							) : (
								<span>{getStringInitials(project.owner)}</span>
							)}
						</div>
						<figcaption>You</figcaption>
					</figure>
				</div>
				<div
					onClick={(e) => dropdownClickHandler(e)}
					className={`dropdown details dropdown-${project.id}`}
					data-id={project.id}
					tabIndex='-1'
				>
					<i
						className={`fas fa-ellipsis-v normal-1 dropdown-button dropdown-button-${project.id}`}
					></i>
					<div className={`dropdown-content dropdown-content-${project.id}`}>
						<span onClick={(e) => detailsModalClickHandler(e)}>Details</span>
					</div>
				</div>
			</div>
		</div>
	);
}; // Title content of the table

const TableHeader = () => {
	return (
		<div className='table__content-th table__content--grid'>
			<span>task name</span>
			<span>person</span>
			<span>status</span>
			<span>deadline</span>
		</div>
	);
}; // Header of the table

const TableRow = ({ task, text, img, messageClickHandler }) => {
	let calculatedDatePercent = `${getComparedDatePercent(
		task.dateCreated,
		task.deadline
	)}%`;
	let getCurrentStatusColor = getStatusColor(task.status);

	return (
		<div className='table__content-tr table__content--grid'>
			<div className='table__content-tr__task cell'>
				<div
					style={{ backgroundColor: getCurrentStatusColor }}
					className='indicator'
				></div>
				<div className='content-wrapper'>
					<span className='content' title={text}>
						{text}
					</span>
				</div>

				<i
					onClick={messageClickHandler}
					className='message-dot far fa-comment-dots'
				></i>
			</div>
			<div className='table__content-tr__avatar cell'>
				<div className='avatar avatar-global'>
					{img ? (
						<img src='' alt='' />
					) : (
						<span>{getStringInitials(task.personName)}</span>
					)}
				</div>
			</div>
			<div className='table__content-tr__status cell'>
				<span style={{ backgroundColor: getCurrentStatusColor }}>
					{task.status}
				</span>
			</div>
			<div className='table__content-tr__deadline cell'>
				<div
					style={{ width: calculatedDatePercent }}
					className='deadline-progress'
				></div>
				<span>{Moment(task.deadline).format('MMM Do YY')}</span>
			</div>
		</div>
	);
}; // Row of the table

/**
 * Main Component of TableOverview
 * TableHolder
 *
 * @param {*} props
 * @returns
 */
const TableTemplate = ({
	project,
	img,
	text,
	messageClickHandler,
	dropdownClickHandler,
	detailsModalClickHandler,
}) => {
	return (
		<div className='table'>
			<TableTitle
				project={project}
				img={img}
				dropdownClickHandler={dropdownClickHandler}
				detailsModalClickHandler={detailsModalClickHandler}
			/>
			<div className='table__content normal-2'>
				<TableHeader />
				{project.tasks.map((task, i) => (
					<TableRow
						key={`pr-${task.id}-${i}`}
						task={task}
						i={i}
						text={text}
						img={img}
						messageClickHandler={messageClickHandler}
					/>
				))}
			</div>
		</div>
	);
};

export default TableTemplate;
