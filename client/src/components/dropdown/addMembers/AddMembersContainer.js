import React, { useState, useContext, useEffect, useRef } from 'react';
import Moment from 'moment';

// ui
import AddMembers from './AddMembers.js';

// context
import { SocketContext } from '../../../context/SocketContext.js';

// helper
import AxiosInstance from '../../../helper/axiosInstance.js';

const AddMembersContainer = ({ data }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState(null);
	const membersEmailRef = useRef();

	const socket = useContext(SocketContext);

	const formSubmitHandler = (e) => {
		e.preventDefault();

		let type = 'invite';
		let emailToInvite = membersEmailRef.current.value;
		let senderData = data.user;
		let sentDate = Moment();
		let projectName = data.project.projectName;
		let projectId = data.project._id;

		let formatToSend = {
			type,
			emailToInvite,
			senderData,
			sentDate,
			project: {
				projectId,
				projectName,
			},
		};

		socket.emit('send_notification', { sendType: 'new', data: formatToSend });

		setIsLoading(true);
		membersEmailRef.current.value = '';
	};

	useEffect(() => {
		let currentUserEmail = data.user.email;

		socket.on('status', (data) => {
			setIsLoading(false);

			let { senderEmail, message } = data;
			if (currentUserEmail === senderEmail) {
				setStatus(message);
			}
		});

		return () => {
			socket.off('status');
		};
	}, [socket, data.user.email]);

	return (
		<AddMembers
			status={status}
			isLoading={isLoading}
			formSubmitHandler={formSubmitHandler}
			membersEmailRef={membersEmailRef}
		/>
	);
};

export default AddMembersContainer;
