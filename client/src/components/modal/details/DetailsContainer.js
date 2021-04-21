import React, { useContext, useEffect, useState } from 'react';

// ui
import Details from './Details.js';

// helper
import Query from '../../../helper/query.js';

// context
import Context from '../../../context/Context.js';
import { SocketContext } from '../../../context/SocketContext.js';

import {
	ProjectMembersGetAction,
	ProjectMembersRemoveAction,
} from '../../../context/actions/project/ProjectMembersAction';

// sub modal
import DialogueContainer from '../../modal/dialogue/DialogueContainer.js';

const DetailsContainer = ({ data, isActive, setIsActive, isCurrentUserOwner }) => {
	const [confirmDialogueOpen, setConfirmDialogueOpen] = useState(false);
	const [currentClickedMember, setCurrentClickedMember] = useState({});

	const socket = useContext(SocketContext);

	const {
		projectMembersState: { projectMembers },
		projectMembersDispatch,
	} = useContext(Context);

	useEffect(() => {
		let pid = data.project._id;

		ProjectMembersGetAction(pid)(projectMembersDispatch);
	}, [projectMembersDispatch, data?.project._id]);

	const removeMemberClickHandler = (e) => {
		let currentMemberId = e.target.dataset.mid;
		let currentMemberEmail = e.target.dataset.email;

		setCurrentClickedMember({ mid: currentMemberId, email: currentMemberEmail });
		setConfirmDialogueOpen(!confirmDialogueOpen);
	};

	const confirmRemoveMemberHandler = () => {
		let formatedData = {
			pid: data?.project._id,
			mid: currentClickedMember.mid,
		};

		ProjectMembersRemoveAction(formatedData)(projectMembersDispatch);
		sendRemoveNoticeToMembers();

		setConfirmDialogueOpen(!confirmDialogueOpen);
	};

	// make this as a bsis when we create the notification for member removal notice
	const sendRemoveNoticeToMembers = () => {
		let emailToNotif = currentClickedMember.email;

		let type = 'removed';
		let projectName = data.project.projectName;
		let _pid = data.project._id;

		let dataToPush = {
			sender: data?.user,
			type,
			projectName,
			_pid,
		};

		socket.emit('send_notif', { emailToNotif, dataToPush, notifType: 'removedMember' });
	};

	// current modal active modifier
	useEffect(() => {
		let detailsModalQuery = Query.detailsModalQuery();

		if (detailsModalQuery) {
			if (isActive) {
				detailsModalQuery.classList.add('active');
			} else {
				detailsModalQuery.classList.remove('active');
			}

			detailsModalQuery.addEventListener('click', (e) => {
				if (e.target === detailsModalQuery) {
					setIsActive(false);
				}
			});
		}
	}, [isActive, setIsActive]);

	if (isActive) {
		return (
			<>
				<Details
					data={data}
					members={projectMembers}
					removeMemberClickHandler={removeMemberClickHandler}
					isCurrentUserOwner={isCurrentUserOwner}
				/>
				<DialogueContainer
					isActive={confirmDialogueOpen}
					setIsActive={setConfirmDialogueOpen}
					confirmActionHandler={confirmRemoveMemberHandler}
				/>
			</>
		);
	}
	return <></>;
};

export default DetailsContainer;
