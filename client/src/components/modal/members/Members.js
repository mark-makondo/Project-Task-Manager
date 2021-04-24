import React from 'react';

// assets
import { ReactComponent as EmptyMembers } from '../../../assets/svg/empty-members.svg';

// helper
import { getStringInitials } from '../../../helper/helperFunctions.js';

const MemberHolder = ({ member, removeMemberClickHandler, isCurrentUserOwner }) => {
	let { _id, joinedDate, isAccepted } = member;
	let avatar = _id.avatar;
	let name = _id.name;
	let email = _id.email;
	let mid = _id._id;

	return (
		<li>
			<div className='members-modal-body__avatar'>
				{avatar !== 'no-avatar' ? (
					<img className='normal-3' src={avatar} alt='avatar' />
				) : (
					<span>{getStringInitials(name)}</span>
				)}
			</div>
			<div className='members-modal-body__content'>
				<div className='details-modal-body__content-name normal-2'>
					<span title={email}>{name}</span>
				</div>
				<div className='members-modal-body__content-status'>
					{isAccepted ? `Joined at ${joinedDate}` : 'Pending Invite.'}
				</div>
			</div>
			{isCurrentUserOwner && (
				<i
					data-email={email}
					data-mid={mid}
					onClick={(e) => removeMemberClickHandler(e)}
					className='members-modal-body__delete fas fa-trash-alt normal-2'
				></i>
			)}
		</li>
	);
};

/**
 * Main component details.
 */
const Details = ({ members, removeMemberClickHandler, isCurrentUserOwner }) => {
	return (
		<div className='members-modal'>
			<div className='members-modal-wrapper'>
				<div className='members-modal-header'>
					<i className='fas fa-user-friends'></i>
					<span className='normal-1'> project members</span>
				</div>
				<div className='members-modal-body normal-3'>
					<ul>
						{members && members.length !== 0 ? (
							members.map((member) => (
								<MemberHolder
									key={member._id._id}
									member={member}
									removeMemberClickHandler={removeMemberClickHandler}
									isCurrentUserOwner={isCurrentUserOwner}
								/>
							))
						) : (
							<EmptyMembers className='empty-members-bg' />
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Details;
