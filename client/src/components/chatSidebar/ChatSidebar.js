import React from 'react';

// chat sub components
import ChatHeaderContainer from '../chat/chatHeader/ChatHeaderContainer.js';
import ChatBodyContainer from '../chat/chatBody/ChatBodyContainer.js';
import ChatFooterContainer from '../chat/chatFooter/ChatFooterContainer.js';

const ChatSidebar = () => {
	return (
		<div className='chat-sidebar'>
			<div className='chat-sidebar-wrapper'>
				<ChatHeaderContainer />
				<ChatBodyContainer />
				<ChatFooterContainer />
			</div>
		</div>
	);
};

export default ChatSidebar;
