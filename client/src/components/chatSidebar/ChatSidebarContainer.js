import React, { useEffect, useContext, useState, useRef, useCallback } from 'react';

// context
import { SocketContext } from '../../context/SocketContext.js';
import Context from '../../context/Context.js';
import { TaskMessageGetAction, TaskMessageAddAction } from '../../context/actions/project/TaskMessageAction.js';

// ui
import ChatSidebar from './ChatSidebar.js';

const ChatSidebarContainer = ({ taskID }) => {
	const initialState = () => localStorage.getItem('local-tid') || taskID;

	const [messages, setMessages] = useState([]);
	const [localtid, setLocatid] = useState(initialState);

	const chatMessageRef = useRef(null);

	const socket = useContext(SocketContext);

	const {
		getOneProjectState: { getOneProject },
	} = useContext(Context);

	const {
		taskMessageState: {
			taskMessage: { isLoading, data },
		},
		taskMessageDispatch,
	} = useContext(Context);

	//#region task message socket logic
	useEffect(() => {
		if (taskID) {
			let setLocal = localStorage.setItem('local-tid', taskID);
			setLocatid(setLocal);
		}
	}, [taskID]);

	useEffect(() => {
		socket.on('received_message', (received) => {
			TaskMessageAddAction(received)(taskMessageDispatch);
		});

		return () => {
			socket.off('received_message');
		};
	}, [socket, messages, taskMessageDispatch]);

	useEffect(() => {
		data && setMessages(data?.messages);
	}, [taskID, data]);

	useEffect(() => {
		!!localtid && TaskMessageGetAction(localtid)(taskMessageDispatch);
	}, [localtid, taskMessageDispatch]);

	useEffect(() => {
		socket.on('connect', () => {
			// console.log(socket.id);
			// console.log('coonnected', socket.connected);
			// console.log('disconnected', socket.disconnected);
		});

		socket.on('disconnect', () => {
			// socket.connect();
		});
	}, [socket]);
	//#endregion

	return (
		<ChatSidebar
			isLoading={isLoading}
			messages={messages}
			data={getOneProject?.data}
			chatMessageRef={chatMessageRef}
			taskData={data}
		/>
	);
};

export default ChatSidebarContainer;
