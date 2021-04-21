import React, { useCallback, useEffect, useRef } from 'react';

// ui
import ChatMessage from './ChatMessage.js';

const ChatMessageContainer = ({ message, data }) => {
	const chatMessageRef = useRef(null);

	const scrollToBottom = useCallback(() => {
		let options = {
			behavior: 'smooth',
			block: 'nearest',
			inline: 'start',
		};
		chatMessageRef.current && chatMessageRef.current.scrollIntoView(options);
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	if (!data) return <></>;
	return <ChatMessage message={message} data={data} chatMessageRef={chatMessageRef} />;
};

export default ChatMessageContainer;
