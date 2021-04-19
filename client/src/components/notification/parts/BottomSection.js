import React from 'react';

export const BottomSection = ({ notification, acceptClickHandler, declineClickHandler }) => {
	let { project, response, _id, sender } = notification;

	let isAccepted = response === 'accepted';
	let isDeclined = response === 'declined';

	let removeDeclineButton = isAccepted ? '' : isDeclined ? 'remove' : '';
	let disableDeclineButton = isDeclined ? true : false;

	let removeAcceptButton = isDeclined ? '' : isAccepted ? 'remove' : '';
	let disableAcceptButton = isAccepted ? true : false;

	return (
		<div className='section-bottom'>
			<button
				data-nid={_id}
				data-pid={project._id}
				data-pname={project.projectName}
				data-senderemail={sender.email}
				onClick={(e) => acceptClickHandler(e)}
				className={`normal-3 ${removeDeclineButton}`}
				disabled={disableAcceptButton}
			>
				Accept
			</button>
			<button
				data-nid={_id}
				data-pid={project._id}
				data-pname={project.projectName}
				data-senderemail={sender.email}
				onClick={(e) => declineClickHandler(e)}
				className={`normal-3 ${removeAcceptButton}`}
				disabled={disableDeclineButton}
			>
				Decline
			</button>
		</div>
	);
};
