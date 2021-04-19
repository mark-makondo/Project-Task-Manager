import React from 'react';

const TableSettings = ({ showProjectDetailsClickHandler, deleteProjectClickHandler, isCurrentUserOwner }) => {
	return (
		<ul className='dropdown-content-table-settings normal-2'>
			<li onClick={(e) => showProjectDetailsClickHandler(e)}>Details</li>
			{isCurrentUserOwner && <li onClick={(e) => deleteProjectClickHandler(e)}>Delete Project</li>}
		</ul>
	);
};

export default TableSettings;
