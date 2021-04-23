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
					<TableHeader />
					<div className='table-project__content normal-2'>
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
					</div>
					{data.user._id === data.project.owner._id && (
						<TableRowAdder submitHandler={submitHandler} inputOnChangeHandler={inputOnChangeHandler} />
					)}
				</>
			) : null}
		</div>
	);
};

export default TableProject;
