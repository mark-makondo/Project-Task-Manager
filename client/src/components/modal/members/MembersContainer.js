import React, { useContext, useEffect, useState } from 'react';

// ui
import Members from './Members.js';

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
import DialogueContainer from '../dialogue/DialogueContainer.js';

const MembersContainer = ({ data, isActive, setIsActive, isCurrentUserOwner }) => {
	const [confirmDialogueOpen, setConfirmDialogueOpen] = useState(false);
	const [currentClickedMember, setCurrentClickedMember] = useState({});
	const [members, setMembers] = useState([]);

	const socket = useContext(SocketContext);

	const {
		projectMembersState: { projectMembers },
		projectMembersDispatch,
	} = useContext(Context);

	useEffect(() => {
		let pid = data.project._id;

		ProjectMembersGetAction(pid)(projectMembersDispatch);
	}, [projectMembersDispatch, data?.project._id]);

	useEffect(() => {
		projectMembers.data && setMembers(projectMembers.data);
	}, [projectMembers.data, members]);

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
		let membersModalQuery = Query.membersModalQuery();

		if (membersModalQuery) {
			if (isActive) {
				membersModalQuery.classList.add('active');
			} else {
				membersModalQuery.classList.remove('active');
			}

			membersModalQuery.addEventListener('click', (e) => {
				if (e.target === membersModalQuery) {
					setIsActive(false);
				}
			});
		}
	}, [isActive, setIsActive]);

	if (isActive) {
		return (
			<>
				<Members
					members={members}
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

export default MembersContainer;
