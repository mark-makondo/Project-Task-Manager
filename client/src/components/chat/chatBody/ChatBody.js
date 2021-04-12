import React from 'react';

// sub components of chat body
import ChatMessageContainer from '../chatMessage/ChatMessageContainer.js';

const ChatBody = () => {
	return (
		<div className='chat-body'>
			<ChatMessageContainer />
		</div>
	);
};

export default ChatBody;
