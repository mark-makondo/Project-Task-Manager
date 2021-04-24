import React from 'react';

const TableSettings = ({
	showUploadedFilesClickHandler,
	showProjectDetailsClickHandler,
	deleteProjectClickHandler,
	isCurrentUserOwner,
}) => {
	return (
		<ul className='dropdown-content-table-settings normal-3'>
			<li onClick={(e) => showProjectDetailsClickHandler(e)}>Members</li>
			<li onClick={(e) => showUploadedFilesClickHandler(e)}>Uploaded Files</li>
			{isCurrentUserOwner && <li onClick={(e) => deleteProjectClickHandler(e)}>Delete Project</li>}
		</ul>
	);
};

export default TableSettings;
