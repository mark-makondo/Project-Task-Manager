import React from 'react';

// chat sub components
import ChatHeaderContainer from '../chat/chatHeader/ChatHeaderContainer.js';
import ChatMessageContainer from '../chat/chatMessage/ChatMessageContainer.js';
import ChatFooterContainer from '../chat/chatFooter/ChatFooterContainer.js';

const ChatSidebar = ({ isLoading, messages, data }) => {
	return (
		<div className='chat-sidebar'>
			<div className='chat-sidebar-wrapper'>
				<ChatHeaderContainer />

				<div className='chat-sidebar-wrapper__body'>
					{!isLoading ? (
						messages &&
						messages.length !== 0 &&
						messages.map((message) => <ChatMessageContainer key={message._id} message={message} data={data} />)
					) : (
						<i className='message-loading fas fa-spinner fa-spin'></i>
					)}
				</div>

				<ChatFooterContainer data={data} />
			</div>
		</div>
	);
};

export default ChatSidebar;
