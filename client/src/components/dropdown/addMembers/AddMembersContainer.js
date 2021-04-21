import React, { useState, useContext, useEffect } from 'react';

// ui
import AddMembers from './AddMembers.js';

// context
import { SocketContext } from '../../../context/SocketContext.js';
import Context from '../../../context/Context.js';
import { ProjectMembersAddAction } from '../../../context/actions/project/ProjectMembersAction.js';

const AddMembersContainer = ({ data }) => {
	const [statusReceived, setStatusReceived] = useState(null);
	const [status, setStatus] = useState(null);
	const [input, setInput] = useState({
		membersEmail: '',
	});

	const socket = useContext(SocketContext);
	const {
		projectMembersState: {
			projectMembers: { isLoading, error },
		},
		projectMembersDispatch,
	} = useContext(Context);

	const formSubmitHandler = (e) => {
		e.preventDefault();

		let emailToNotif = input.membersEmail;
		let _pid = data?.project._id;

		ProjectMembersAddAction({ _pid, memberToInviteEmail: emailToNotif })(projectMembersDispatch);
	};

	useEffect(() => {
		socket.on('invitation_sent', (content) => {
			let isUserTheSame = content.currentUserId === data?.user._id;
			setStatus('Invitation sent!');
			setStatusReceived({ received: true, isUserTheSame });
		});

		error && setStatus(error);

		return () => {
			socket.off('invitation_sent');
		};
	}, [socket, error, data?.user._id]);

	useEffect(() => {
		let emailToNotif = input.membersEmail;

		let type = 'invite';
		let projectName = data.project.projectName;
		let _pid = data.project._id;

		let dataToPush = {
			sender: data?.user,
			type,
			response: 'none',
			projectName,
			_pid,
		};

		if (statusReceived) {
			if (statusReceived.received === true && statusReceived.isUserTheSame === true) {
				socket.emit('send_notif', { emailToNotif, dataToPush, notifType: 'inviteMembers' });
			}
			input.membersEmail = '';
			setStatusReceived(null);
		}

		return () => {
			socket.off('send_notif');
		};
	}, [
		input,
		input.membersEmail,
		socket,
		statusReceived,
		statusReceived?.received,
		statusReceived?.isUserTheSame,
		data.project.projectName,
		data.project._id,
		data?.user,
	]);

	const inputOnChange = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	};
	return (
		<AddMembers
			status={status}
			isLoading={isLoading}
			formSubmitHandler={formSubmitHandler}
			inputOnChange={inputOnChange}
			input={input}
		/>
	);
};

export default AddMembersContainer;
