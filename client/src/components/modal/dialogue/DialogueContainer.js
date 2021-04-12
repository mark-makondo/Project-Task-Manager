import React from 'react';

// ui
import Dialogue from './Dialogue.js';

const DialogueContainer = ({ isActive, setIsActive, confirmActionHandler }) => {
	const cancelActionHandler = () => {
		setIsActive(false);
	};

	const confirmDialogueHandler = (e) => {
		if (e.currentTarget === e.target) setIsActive(false);
	};

	if (isActive)
		return (
			<Dialogue
				confirmActionHandler={confirmActionHandler}
				cancelActionHandler={cancelActionHandler}
				confirmDialogueHandler={confirmDialogueHandler}
			/>
		);

	return <></>;
};

export default DialogueContainer;
