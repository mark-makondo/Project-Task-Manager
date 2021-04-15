import React, { useEffect, useContext, useState } from 'react';

// context
import { SocketContext } from '../../context/SocketContext.js';
import Context from '../../context/Context.js';
import { TaskMessageAction } from '../../context/actions/project/TaskMessageAction.js';

// ui
import ChatSidebar from './ChatSidebar.js';

const ChatSidebarContainer = ({ taskID, isChatSidebarActive }) => {
	const initialState = () => localStorage.getItem('local-tid') || taskID;

	const [messages, setMessages] = useState([]);
	const [localtid, setLocatid] = useState(initialState);

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

	useEffect(() => {
		if (taskID) {
			let setLocal = localStorage.setItem('local-tid', taskID);
			setLocatid(setLocal);
		}
	}, [taskID]);

	useEffect(() => {
		socket.on('received_message', (received) => {
			setMessages([...messages, received]);
		});

		return () => {
			socket.off('received_message');
		};
	}, [socket, messages]);

	useEffect(() => {
		let isMessage = data ? data?.messages : [];

		setMessages(isMessage);
	}, [taskID, data]);

	useEffect(() => {
		!!localtid && TaskMessageAction(localtid, 'get')(taskMessageDispatch);
	}, [localtid, taskMessageDispatch]);

	useEffect(() => {
		socket.on('connect', () => {
			console.log(socket.id);
			console.log('coonnected', socket.connected);
			console.log('disconnected', socket.disconnected);
		});

		// uncomment is something goes wrong when you go back
		// socket.emit('join', taskID);

		socket.on('disconnect', () => {
			socket.connect();
		});
	}, [socket]);
	// useEffect(() => {
	// 	if (isChatSidebarActive) {
	// 		socket.emit('join', taskID);
	// 	} else {
	// 		socket.disconnect();
	// 		socket.off();
	// 	}
	// }, [isChatSidebarActive, socket, taskID]);

	// socket.on('connect', (socket) => {
	// 	console.log('hello', socket);
	// });// socket.emit('join', taskID);
	// return () => {
	// 	socket.disconnect();
	// };
	return (
		<ChatSidebar
			isLoading={isLoading}
			messages={messages}
			data={getOneProject?.data}
			isChatSidebarActive={isChatSidebarActive}
		/>
	);
};

export default ChatSidebarContainer;
