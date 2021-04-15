import React from 'react';

const ChatHeader = () => {
	return (
		<div className='chat-header'>
			<div className='chat-header-wrapper'>
				<h2 className='chat-header-wrapper__title normal-1'>default task</h2>
				<div className='chat-header-wrapper__sub-title normal-2'>
					Assigned to <span>Mark Albert Makondo</span>
				</div>
			</div>
		</div>
	);
};

export default ChatHeader;
