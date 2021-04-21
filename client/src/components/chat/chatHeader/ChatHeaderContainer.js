import React from 'react';

// helper
import Query from '../../../helper/query.js';

// ui
import ChatHeader from './ChatHeader.js';

const ChatHeaderContainer = ({ taskData }) => {
	const sidebarCloseHandler = (e) => {
		let query = Query.chatSideBarContainer();
		query.classList.remove('active');
	};

	return <ChatHeader taskData={taskData} sidebarCloseHandler={sidebarCloseHandler} />;
};

export default ChatHeaderContainer;
