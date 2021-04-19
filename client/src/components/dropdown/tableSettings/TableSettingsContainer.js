import React, { useContext, useState } from 'react';

// ui
import TableSettings from './TableSettings';

// modal
import DialogueContainer from '../../modal/dialogue/DialogueContainer.js';
import DetailsModalContainer from '../../modal/details/DetailsContainer.js';

// context
import Context from '../../../context/Context.js';
import { TaskAction } from '../../../context/actions/project/TaskAction.js';
import { GetMembersAction } from '../../../context/actions/project/GetMembersAction.js';

const TableSettingsContainer = ({ data, isCurrentUserOwner }) => {
	const [confirmProjectDeleteDialogueOpen, setConfirmProjectDeleteDialogueOpen] = useState(false);
	const [detailsIsActive, setDetailsIsActive] = useState(false);

	const { getOneProjectDispatch } = useContext(Context);
	const { membersDispatch } = useContext(Context);

	//#region
	const showProjectDetailsClickHandler = (e) => {
		let pid = data?.project._id;

		GetMembersAction(pid)(membersDispatch);
		setDetailsIsActive(!detailsIsActive);
	};

	//#endregion

	//#region delete project logic
	const deleteProjectClickHandler = (e) => {
		setConfirmProjectDeleteDialogueOpen(!confirmProjectDeleteDialogueOpen);
	};

	const confirmProjectDeleteHandler = () => {
		let type = 'removeProject';
		let formatedData = {
			_pid: data?.project._id,
			_id: data?.user._id,
		};

		TaskAction(formatedData, type)(getOneProjectDispatch);
		setConfirmProjectDeleteDialogueOpen(!confirmProjectDeleteDialogueOpen);
		localStorage.removeItem('local-tid');
	};

	//#endregion

	return (
		<>
			<TableSettings
				showProjectDetailsClickHandler={showProjectDetailsClickHandler}
				deleteProjectClickHandler={deleteProjectClickHandler}
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
		</>
	);
};

export default TableSettingsContainer;
