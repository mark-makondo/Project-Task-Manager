import React from 'react';

// ui
import ChatMessage from './ChatMessage.js';

const ChatMessageContainer = ({ message, data }) => {
	if (!data) return <></>;
	return <ChatMessage message={message} data={data} />;
};

export default ChatMessageContainer;
