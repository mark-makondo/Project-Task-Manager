import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// helper functions
import { getStringInitials, getComparedDatePercent, getStatusColor } from '../../../helper/helperFunctions.js';

// dropdown
import SelectContainer from '../../../components/dropdown/select/SelectContainer.js';

const TableProjectTitle = ({ data, ellipsisClickHandler, showEllipsisDropdown }) => {
	return (
		<div className='table-project__title'>
			<div className='table-project__title-name normal-1'>{data.project.projectName}</div>
			<div className='table-project__title-right'>
				<button className='table-project__title-members-add normal-2'>
					<i className='fas fa-user-plus'></i>
					<span>Members</span>
				</button>
				<div className='table-project__title-avatar normal-2'>
					<span>Owner: </span>
					<figure>
						<div className='avatar avatar-global'>
							{!!data && data.user.avatar !== 'no-avatar' ? (
								<img className='normal-3' src={data.user.avatar} alt='avatar' />
							) : (
								<span>{getStringInitials(data.project.owner.name)}</span>
							)}
						</div>
						<figcaption>
							{data.user.email === data.project.owner.email ? 'You' : data.project.owner.name}
						</figcaption>
					</figure>
				</div>
				<div className='dropdown-ellipsis' data-id={data.project._id}>
					<i onClick={(e) => showEllipsisDropdown(e)} className='fas fa-ellipsis-v normal-1 dropdown-button'></i>

					<SelectContainer
						data={[
							{ data: 'details', id: 0 },
							{ data: 'delete project', id: 1 },
						]}
						itemClickHandler={ellipsisClickHandler}
					/>
				</div>
			</div>
		</div>
	);
};

const TableHeader = () => {
	return (
		<div className='table-project__content-th table-project__content--grid'>
			<span>task name</span>
			<span>person</span>
			<span>status</span>
			<span>deadline</span>
		</div>
	);
};

const TableRow = ({
	task,
	taskDeleteClickHandler,
	taskEditClickHandler,
	taskSaveClickHandler,
	taskNameEditOnChange,
	showStatusDropdown,
	selectedStatusClickHandler,
	dateSelectHandler,
	showMessageSidebar,
}) => {
	let calculatedDatePercent = `${getComparedDatePercent(task.created_at, task.deadline)}%`;
	let getCurrentStatusColor = getStatusColor(!!task.status && task.status);

	return (
		<div className='table-project__content-tr table-project__content--grid'>
			<div
				data-tid={task._id}
				data-tname={task.taskName}
				onClick={(e) => showMessageSidebar(e)}
				className='table-project__content-tr__task cell'
			>
				<div style={{ backgroundColor: getCurrentStatusColor }} className='indicator'></div>
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
				<div className={`edit-wrapper icon edit-wrapper--${task._id}`}>
					<i data-tid={task._id} onClick={(e) => taskEditClickHandler(e)} className='edit fas fa-edit'></i>
					<i data-tid={task._id} onClick={(e) => taskSaveClickHandler(e)} className=' save fas fa-check'></i>
				</div>

				<i
					data-tid={task._id}
					onClick={(e) => taskDeleteClickHandler(e)}
					className='icon delete fas fa-trash-alt'
				></i>
				<i
					data-tid={task._id}
					data-tname={task.taskName}
					onClick={(e) => showMessageSidebar(e)}
					className='message-dot far fa-comment-dots'
				></i>
			</div>
			<div className='table-project__content-tr__avatar cell'>
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
			<div className={`table-project__content-tr__status  table-project__content-tr__status--${task._id} cell`}>
				<div
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
				/>
			</div>
			<div className={`table-project__content-tr__deadline table-project__content-tr__deadline--${task._id} cell`}>
				<div style={{ width: calculatedDatePercent }} className='deadline-progress'></div>

				<DatePicker
					dateFormat='MM-dd-yyyy'
					className='deadline-input'
					calendarClassName='deadline-calendar'
					selected={!!task.deadline && new Date(task.deadline)}
					startDate={!!task.deadline && new Date(task.deadline)}
					minDate={new Date()}
					onSelect={(date) => dateSelectHandler(date, task._id)}
					closeOnScroll={true}
					showYearDropdown={true}
					scrollableYearDropdown={true}
					popperPlacement='top-end'
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
		</div>
	);
};

const TableRowAdder = ({ inputOnChangeHandler, submitHandler }) => {
	return (
		<div className='table-project__content-tr-adder'>
			<div className='indicator'></div>
			<form className='content-wrapper' onSubmit={(e) => submitHandler(e)}>
				<input
					autoComplete='off'
					onChange={(e) => inputOnChangeHandler(e)}
					className='normal-2'
					placeholder='+ Add new row'
					name='taskName'
				></input>
				<button type='submit'>Add</button>
			</form>
		</div>
	);
};

/**
 * Main Component of TableProject
 * TableHolder
 *
 * @param {*} props
 * @returns
 */
const TableProject = ({
	isLoading,
	data,
	submitHandler,
	inputOnChangeHandler,
	taskDeleteClickHandler,
	taskEditClickHandler,
	taskSaveClickHandler,
	taskNameEditOnChange,
	showStatusDropdown,
	selectedStatusClickHandler,
	dateSelectHandler,
	ellipsisClickHandler,
	showEllipsisDropdown,
	showMessageSidebar,
}) => {
	return (
		<div className='table-project'>
			{!!data && !isLoading ? (
				<>
					<TableProjectTitle
						data={data}
						ellipsisClickHandler={ellipsisClickHandler}
						showEllipsisDropdown={showEllipsisDropdown}
					/>
					<div className='table-project__content normal-2'>
						<TableHeader />
						{data.project.tasks.map((task) => (
							<TableRow
								key={`pr-${task._id}`}
								task={task}
								taskDeleteClickHandler={taskDeleteClickHandler}
								taskEditClickHandler={taskEditClickHandler}
								taskSaveClickHandler={taskSaveClickHandler}
								taskNameEditOnChange={taskNameEditOnChange}
								showStatusDropdown={showStatusDropdown}
								selectedStatusClickHandler={selectedStatusClickHandler}
								dateSelectHandler={dateSelectHandler}
								showEllipsisDropdown={showEllipsisDropdown}
								showMessageSidebar={showMessageSidebar}
							/>
						))}
						<TableRowAdder submitHandler={submitHandler} inputOnChangeHandler={inputOnChangeHandler} />
					</div>
				</>
			) : (
				<i className='table-project-loading fas fa-spinner fa-spin'></i>
			)}
		</div>
	);
};

export default TableProject;
