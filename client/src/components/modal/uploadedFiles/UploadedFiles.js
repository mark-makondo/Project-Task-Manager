import React from 'react';

// assets
import { ReactComponent as EmptyTask } from '../../../assets/svg/empty-task.svg';

// helper
import { ToggleArrow } from '../../../helper/helperFunctions.js';

const TaskUploadedFilesHolder = ({ toggleCollation, clicked, indexName, lists }) => {
	return (
		<section className={`uploaded-files-modal-body__tasks-${indexName}`}>
			<div onClick={() => toggleCollation(indexName)} className='file-upload-info'>
				<span>
					<strong>{indexName}</strong>
				</span>
				<span>- {lists.length === 0 ? 'no uploads.' : lists && `${lists.length} uploads.`}</span>
				<ToggleArrow click={clicked} name={indexName} />
			</div>
			<ul className='file-upload-list'>
				{lists &&
					lists.length !== 0 &&
					lists.map((file) =>
						clicked === indexName ? (
							<li key={file._id} className='normal-3'>
								<span className='file-upload-list__name' title={file.fileName}>
									<a className='normal-3' href={file.googleViewLink}>
										{file.fileName}
									</a>
								</span>
								<span title='Click to Download.'>
									<a className='file-upload-list__viewlink' href={file.googleDownloadLink}>
										<i className='fas fa-save'></i>
									</a>
								</span>
								<span title='Click to view link.'>
									<a className='file-upload-list__downloadlink' href={file.googleViewLink}>
										<i className='fas fa-eye'></i>
									</a>
								</span>
							</li>
						) : null
					)}
			</ul>
		</section>
	);
};

const TaskLists = ({ projectTasks, toggleCollation, clicked }) => {
	console.log(projectTasks);
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

/**
 * Main component details.
 */
const UploadedFiles = ({ data, isLoading, toggleCollation, clicked }) => {
	let { project } = data;
	let projectTasks = project?.tasks;

	let styleForLoading = {
		overflow: `${isLoading ? 'hidden' : ''}`,
	};

	return (
		<div className='uploaded-files-modal'>
			<div className='uploaded-files-modal-wrapper'>
				<div className='uploaded-files-modal-header'>
					<i className='fas fa-archive'></i>
					<span className='normal-1'> uploaded files</span>
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
		</div>
	);
};

export default UploadedFiles;
