import React from 'react';

// assets
import { ReactComponent as EmptyMembers } from '../../../assets/svg/empty-members.svg';

// helper
import { getStringInitials } from '../../../helper/helperFunctions.js';

const MemberHolder = ({ member }) => {
	let { _id, joinedDate, isAccepted } = member;
	let avatar = _id.avatar;
	let name = _id.name;
	let email = _id.email;

	return (
		<li>
			<div className='overview-members-modal-body__avatar'>
				{avatar !== 'no-avatar' ? (
					<img className='normal-3' src={avatar} alt='avatar' />
				) : (
					<span>{getStringInitials(name)}</span>
				)}
			</div>
			<div className='overview-members-modal-body__content'>
				<div className='overview-members-modal-body__content-name normal-2'>
					<span title={email}>{name}</span>
				</div>
				<div className='overview-members-modal-body__content-status'>
					{isAccepted ? `Joined at ${joinedDate}` : 'Pending Invite.'}
				</div>
			</div>
		</li>
	);
};

/**
 * Main component modal members.
 */
const OverviewMembers = ({ data, isLoading }) => {
	let isProject = data && data.project;
	let projectMembers = isProject?.members;
	let projectName = isProject?.projectName;

	let styleForLoading = {
		overflow: `${isLoading ? 'hidden' : 'unset'}`,
	};

	return (
		<div className='overview-members-modal'>
			<div className='overview-members-modal-wrapper'>
				<div className='overview-members-modal-header'>
					<div className='overview-members-modal-header__title'>
						<i className='fas fa-user-friends'></i>
						<span className='normal-1'> project members</span>
					</div>
					<span className='overview-members-modal-header__projectname normal-2'>{projectName}</span>
				</div>
				<div style={styleForLoading} className='overview-members-modal-body normal-3'>
					<ul>
						{!isLoading ? (
							projectMembers && projectMembers.length !== 0 ? (
								projectMembers.map((member) => <MemberHolder key={member._id._id} member={member} />)
							) : (
								<EmptyMembers className='empty-members-bg' />
							)
						) : (
							<i className='overview-members-modal-loading fas fa-spinner fa-spin'></i>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default OverviewMembers;
