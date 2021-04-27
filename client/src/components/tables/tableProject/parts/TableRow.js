import React from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// helper functions
import { getStringInitials, getComparedDatePercent, getStatusColor } from '../../../../helper/helperFunctions.js';

// dropdown
import SelectContainer from '../../../../components/dropdown/select/SelectContainer.js';

const TaskName = ({
	task,
	showMessageSidebar,
	getCurrentStatusColor,
	taskNameEditOnChange,
	taskEditClickHandler,
	taskSaveClickHandler,
	taskDeleteClickHandler,
	isCurrentUserOwner,
}) => {
	return (
		<div data-tname={task.taskName} className='table-project__content-tr__task cell'>
			<div
				data-tid={task._id}
				onClick={(e) => showMessageSidebar(e)}
				style={{ backgroundColor: getCurrentStatusColor }}
				className='indicator'
			></div>
			<div className={`content-wrapper content-wrapper--${task._id}`}>
				<span className='content content--span' title={task.taskName}>
					{task.taskName}
				</span>
				<input
					type='text'
					autoComplete='off'
					className='content content--input normal-2'
					onChange={(e) => taskNameEditOnChange(e)}
					name='taskName'
					defaultValue={task.taskName}
				/>
			</div>
			{isCurrentUserOwner && (
				<div className={`edit-wrapper icon edit-wrapper--${task._id}`}>
					<i data-tid={task._id} onClick={(e) => taskEditClickHandler(e)} className='edit fas fa-edit'></i>
					<i data-tid={task._id} onClick={(e) => taskSaveClickHandler(e)} className=' save fas fa-check'></i>
				</div>
			)}
			{isCurrentUserOwner && (
				<i
					data-tid={task._id}
					onClick={(e) => taskDeleteClickHandler(e)}
					className='icon delete fas fa-trash-alt'
				></i>
			)}

			<i
				data-tid={task._id}
				data-tname={task.taskName}
				onClick={(e) => showMessageSidebar(e)}
				className='message-dot far fa-comment-dots'
			></i>
		</div>
	);
};

const Person = ({
	task,
	data,
	isCurrentUserOwner,
	showPersonsDropdown,
	selectedPersonClickHandler,
	projectMembers,
}) => {
	return (
		<div className={`table-project__content-tr__avatar table-project__content-tr__avatar--${task._id} cell`}>
			<div
				tabIndex={-1}
				data-tid={task._id}
				onClick={(e) => isCurrentUserOwner && showPersonsDropdown(e)}
				className='table-project__content-tr__avatar-wrapper avatar avatar-global dropdown-button'
			>
				{!!task.assigned &&
					(task.assigned.avatar !== 'no-avatar' ? (
						<img src={task.assigned.avatar} alt='avatar' />
					) : (
						<span title={task.assigned.email}>{getStringInitials(task.assigned.name)}</span>
					))}
				{isCurrentUserOwner && <i className='avatar-plus fas fa-plus'></i>}
			</div>

			<SelectContainer
				data={data}
				itemClickHandler={selectedPersonClickHandler}
				type='2'
				tid={task._id}
				projectMembers={projectMembers}
			/>
		</div>
	);
};

const Status = ({
	task,
	getCurrentStatusColor,
	showStatusDropdown,
	selectedStatusClickHandler,
	isCurrentUserOwner,
	isCurrentUserAssigned,
}) => {
	return (
		<div className={`table-project__content-tr__status  table-project__content-tr__status--${task._id} cell`}>
			{isCurrentUserOwner | isCurrentUserAssigned ? (
				<>
					<div
						tabIndex={-1}
						style={{ backgroundColor: getCurrentStatusColor }}
						data-tid={task._id}
						className='status-wrapper'
						onClick={(e) => {
							showStatusDropdown(e);
						}}
					>
						<span>{!!task.status && task.status}</span>
						<i className='fas fa-angle-down'></i>
					</div>

					<SelectContainer
						data={[
							{ data: 'working', id: task._id },
							{ data: 'stuck', id: task._id },
							{ data: 'completed', id: task._id },
						]}
						itemClickHandler={selectedStatusClickHandler}
						type='1'
					/>
				</>
			) : (
				<div style={{ backgroundColor: getCurrentStatusColor }} data-tid={task._id} className='status-wrapper'>
					<span>{!!task.status && task.status}</span>
				</div>
			)}
		</div>
	);
};

const Deadline = ({ task, calculatedDatePercent, dateSelectHandler, isCurrentUserOwner }) => {
	return (
		<div className={`table-project__content-tr__deadline table-project__content-tr__deadline--${task._id} cell`}>
			<div style={{ width: calculatedDatePercent }} className='deadline-progress'></div>

			<DatePicker
				dateFormat='MM-dd-yyyy'
				className={`deadline-input ${!isCurrentUserOwner && 'disabled'}`}
				calendarClassName='deadline-calendar'
				selected={!!task.deadline && new Date(task.deadline)}
				startDate={!!task.deadline && new Date(task.deadline)}
				minDate={new Date()}
				onSelect={(date) => dateSelectHandler(date, task._id)}
				closeOnScroll={true}
				showYearDropdown={true}
				scrollableYearDropdown={true}
				popperPlacement='bottom-end'
				popperModifiers={{
					offset: {
						enabled: true,
						offset: '-100%, 10px',
					},
					preventOverflow: {
						enabled: true,
						escapeWithReference: false,
						boundariesElement: 'viewport',
					},
				}}
			/>
		</div>
	);
};

/**
 * Main table row.
 */
const TableRow = ({
	data,
	task,
	taskDeleteClickHandler,
	taskEditClickHandler,
	taskSaveClickHandler,
	taskNameEditOnChange,
	showStatusDropdown,
	selectedStatusClickHandler,
	dateSelectHandler,
	showMessageSidebar,
	showPersonsDropdown,
	selectedPersonClickHandler,
	projectMembers,
}) => {
	let calculatedDatePercent = `${getComparedDatePercent(task.created_at, task.deadline)}%`;
	let getCurrentStatusColor = getStatusColor(!!task.status && task.status);
	let isCurrentUserOwner = data.user._id === data.project.owner._id;
	let isCurrentUserAssigned = data.user._id === task.assigned._id;

	return (
		<div className='table-project__content-tr table-project__content--grid'>
			<TaskName
				task={task}
				showMessageSidebar={showMessageSidebar}
				getCurrentStatusColor={getCurrentStatusColor}
				taskNameEditOnChange={taskNameEditOnChange}
				taskEditClickHandler={taskEditClickHandler}
				taskSaveClickHandler={taskSaveClickHandler}
				taskDeleteClickHandler={taskDeleteClickHandler}
				isCurrentUserOwner={isCurrentUserOwner}
			/>

			<Person
				data={data}
				task={task}
				isCurrentUserOwner={isCurrentUserOwner}
				showPersonsDropdown={showPersonsDropdown}
				selectedPersonClickHandler={selectedPersonClickHandler}
				projectMembers={projectMembers}
			/>
			<Status
				task={task}
				getCurrentStatusColor={getCurrentStatusColor}
				showStatusDropdown={showStatusDropdown}
				selectedStatusClickHandler={selectedStatusClickHandler}
				isCurrentUserOwner={isCurrentUserOwner}
				isCurrentUserAssigned={isCurrentUserAssigned}
			/>
			<Deadline
				task={task}
				calculatedDatePercent={calculatedDatePercent}
				dateSelectHandler={dateSelectHandler}
				isCurrentUserOwner={isCurrentUserOwner}
			/>
		</div>
	);
};

export default TableRow;
