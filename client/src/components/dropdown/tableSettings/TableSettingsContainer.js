import React, { useContext, useEffect, useState } from 'react';

// ui
import TableSettings from './TableSettings';

// modal
import DialogueContainer from '../../modal/dialogue/DialogueContainer.js';
import DetailsModalContainer from '../../modal/details/DetailsContainer.js';
import UploadedFilesModalContainer from '../../modal/uploadedFiles/UploadedFIlesContainer.js';

// context
import Context from '../../../context/Context.js';
import { RemoveProjectAction } from '../../../context/actions/project/ProjectAction';
import { ProjectMembersGetAction } from '../../../context/actions/project/ProjectMembersAction';
import { SocketContext } from '../../../context/SocketContext.js';

const TableSettingsContainer = ({ data, isCurrentUserOwner }) => {
	const [confirmProjectDeleteDialogueOpen, setConfirmProjectDeleteDialogueOpen] = useState(false);
	const [detailsIsActive, setDetailsIsActive] = useState(false);
	const [uploadedModalIsActive, setUploadedModalIsActive] = useState(false);

	const { projectDispatch } = useContext(Context);
	const { projectMembersDispatch } = useContext(Context);
	const socket = useContext(SocketContext);

	//#region table details settings
	const showProjectDetailsClickHandler = (e) => {
		let pid = data?.project._id;

		ProjectMembersGetAction(pid)(projectMembersDispatch);
		setDetailsIsActive(!detailsIsActive);
	};

	//#endregion

	//#region delete project logic
	useEffect(() => {}, [socket]);

	const deleteProjectClickHandler = (e) => {
		setConfirmProjectDeleteDialogueOpen(!confirmProjectDeleteDialogueOpen);
	};

	const confirmProjectDeleteHandler = () => {
		let projectId = data?.project._id;

		let userId = data?.user._id;
		let formatedData = {
			_pid: projectId,
			_id: userId,
		};

		sendDeleteNoticeToMembers();
		RemoveProjectAction(formatedData)(projectDispatch);

		setConfirmProjectDeleteDialogueOpen(!confirmProjectDeleteDialogueOpen);
		localStorage.removeItem('local-tid');
	};

	const sendDeleteNoticeToMembers = () => {
		let acceptedMembers = data?.project.members
			.filter((member) => {
				return member.isAccepted === true;
			})
			.map((email) => {
				return email._id.email;
			});

		let emailToNotif = acceptedMembers;

		let type = 'deleted';
		let projectName = data.project.projectName;
		let _pid = data.project._id;

		let dataToPush = {
			sender: data?.user,
			type,
			response: 'none',
			projectName,
			_pid,
		};

		socket.emit('send_notif', { emailToNotif, dataToPush, notifType: 'deleteProject' });
	};

	//#endregion

	//#region show table uploaded files settings
	const showUploadedFilesClickHandler = () => {
		setUploadedModalIsActive(!uploadedModalIsActive);
	};
	//#endregion

	return (
		<>
			<TableSettings
				showProjectDetailsClickHandler={showProjectDetailsClickHandler}
				deleteProjectClickHandler={deleteProjectClickHandler}
				showUploadedFilesClickHandler={showUploadedFilesClickHandler}
				isCurrentUserOwner={isCurrentUserOwner}
			/>
			<DialogueContainer
				isActive={confirmProjectDeleteDialogueOpen}
				setIsActive={setConfirmProjectDeleteDialogueOpen}
				confirmActionHandler={confirmProjectDeleteHandler}
			/>
			<DetailsModalContainer
				data={data}
				isActive={detailsIsActive}
				setIsActive={setDetailsIsActive}
				isCurrentUserOwner={isCurrentUserOwner}
			/>
			<UploadedFilesModalContainer
				data={data}
				isActive={uploadedModalIsActive}
				setIsActive={setUploadedModalIsActive}
			/>
		</>
	);
};

export default TableSettingsContainer;
