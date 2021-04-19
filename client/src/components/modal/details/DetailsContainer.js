import React, { useContext, useEffect, useState } from 'react';

// ui
import Details from './Details.js';

// helper
import Query from '../../../helper/query.js';

// context
import Context from '../../../context/Context.js';
import { GetMembersAction } from '../../../context/actions/project/GetMembersAction.js';
import { RemoveMembersAction } from '../../../context/actions/project/RemoveMemberAction';

// sub modal
import DialogueContainer from '../../modal/dialogue/DialogueContainer.js';

const DetailsContainer = ({ data, isActive, setIsActive, isCurrentUserOwner }) => {
	const [confirmDialogueOpen, setConfirmDialogueOpen] = useState(false);
	const [currentClickedMember, setCurrentClickedMember] = useState();

	const {
		membersState: { members },
		membersDispatch,
	} = useContext(Context);

	useEffect(() => {
		let pid = data.project._id;

		GetMembersAction(pid)(membersDispatch);
	}, [membersDispatch, data?.project._id]);

	const removeMemberClickHandler = (e) => {
		let currentMember = e.target.dataset.mid;

		setCurrentClickedMember(currentMember);
		setConfirmDialogueOpen(!confirmDialogueOpen);
	};

	const confirmRemoveMemberHandler = () => {
		let formatedData = {
			pid: data?.project._id,
			mid: currentClickedMember,
		};

		RemoveMembersAction(formatedData)(membersDispatch);
		setConfirmDialogueOpen(!confirmDialogueOpen);
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

export default DetailsContainer;
