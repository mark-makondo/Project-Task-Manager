import React from 'react';

const ChatHeader = ({ taskData, sidebarCloseHandler }) => {
	let assignedEmail = taskData && taskData.assigned.email;
	let taskName = taskData && taskData.taskName;
	let assignedName = taskData && taskData.assigned.name;

	return (
		<div className='chat-header'>
			<div className='chat-header-wrapper'>
				<h2 className='chat-header-wrapper__title normal-1'>{taskName}</h2>
				<div className='chat-header-wrapper__sub-title normal-2'>
					Assigned to <span title={assignedEmail}>{assignedName}</span>
				</div>
			</div>
			<i onClick={(e) => sidebarCloseHandler(e)} className='chat-header-close fas fa-arrow-alt-circle-right'></i>
		</div>
	);
};

export default ChatHeader;
