import React from 'react';

// parts
import TableProjectTitle from './parts/TableProjectTitle.js';
import TableHeader from './parts/TableHeader.js';
import TableRow from './parts/TableRow.js';
import TableRowAdder from './parts/TableRowAdder.js';

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
	showAddMembersDropdown,
	showPersonsDropdown,
	selectedPersonClickHandler,
	projectTaskData,
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
						{!isLoading ? (
							projectTaskData &&
							projectTaskData.data?.length !== 0 &&
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
								/>
							))
						) : (
							<i className='project-loading fas fa-spinner fa-spin'></i>
						)}
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
