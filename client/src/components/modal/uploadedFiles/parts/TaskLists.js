import React from 'react';

// sub components
import TaskUploadedFilesHolder from './TaskUploadedFilesHolder.js';

const TaskLists = ({ projectTasks, toggleCollation, clicked }) => {
	return (
		<div className='uploaded-files-modal-body__tasks'>
			{projectTasks.map((task) => (
				<TaskUploadedFilesHolder
					key={task._id}
					toggleCollation={toggleCollation}
					clicked={clicked}
					indexName={task.taskName}
					lists={task.fileUpload}
				/>
			))}
		</div>
	);
};

export default TaskLists;
