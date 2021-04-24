import React from 'react';

// sub components
import UploadedFilesWrapper from './parts/UploadedFilesWrapper.js';

/**
 * Main component details for project page.
 */
const UploadedFiles = ({ project, isLoading, toggleCollation, clicked }) => {
	let projectTasks = project?.tasks;
	let projectName = project?.projectName;

	let styleForLoading = {
		overflow: `${isLoading ? 'hidden' : ''}`,
	};

	return (
		<div className='uploaded-files-modal'>
			<UploadedFilesWrapper
				projectName={projectName}
				styleForLoading={styleForLoading}
				isLoading={isLoading}
				projectTasks={projectTasks}
				toggleCollation={toggleCollation}
				clicked={clicked}
			/>
		</div>
	);
};

export default UploadedFiles;
