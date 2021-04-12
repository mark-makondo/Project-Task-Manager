import React from 'react';

const Dialogue = ({ confirmActionHandler, cancelActionHandler, confirmDialogueHandler }) => {
	return (
		<div
			className='confirm-dialogue'
			onClick={(e) => {
				confirmDialogueHandler(e);
			}}
		>
			<div className='confirm-dialogue-wrapper'>
				<h2>Confirm Action</h2>

				<div className='confirm-dialogue-buttons'>
					<button className='normal-3' onClick={(e) => confirmActionHandler(e)}>
						Yes
					</button>
					<button className='normal-3' onClick={(e) => cancelActionHandler(e)}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default Dialogue;
