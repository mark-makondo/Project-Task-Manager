import React from 'react';

// parts
import TableProjectTitle from './parts/TableProjectTitle.js';
import TableHeader from './parts/TableHeader.js';
import TableRow from './parts/TableRow.js';
import TableRowAdder from './parts/TableRowAdder.js';

const TableProject = ({
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
	showAddMembersDropdown,
	showPersonsDropdown,
	selectedPersonClickHandler,
	projectTaskData,
	projectMembers,
}) => {
	return (
		<div className='table-project'>
			{!!data ? (
				<>
					<TableProjectTitle
						data={data}
						ellipsisClickHandler={ellipsisClickHandler}
						showEllipsisDropdown={showEllipsisDropdown}
						showAddMembersDropdown={showAddMembersDropdown}
					/>
					<div className='table-project__content normal-2'>
						<TableHeader />
						{projectTaskData &&
							projectTaskData.data?.map((task) => (
								<TableRow
									data={data}
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
									showPersonsDropdown={showPersonsDropdown}
									selectedPersonClickHandler={selectedPersonClickHandler}
									projectMembers={projectMembers}
								/>
							))}
						{data.user._id === data.project.owner._id && (
							<TableRowAdder submitHandler={submitHandler} inputOnChangeHandler={inputOnChangeHandler} />
						)}
					</div>
				</>
			) : (
				<i className='table-project-loading fas fa-spinner fa-spin'></i>
			)}
		</div>
	);
};

export default TableProject;
