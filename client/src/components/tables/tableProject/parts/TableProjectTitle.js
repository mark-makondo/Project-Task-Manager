import React from 'react';

// helper functions
import { getStringInitials } from '../../../../helper/helperFunctions.js';

// dropdown
import AddMembersContainer from '../../../../components/dropdown/addMembers/AddMembersContainer.js';
import TableSettingsContainer from '../../../../components/dropdown/tableSettings/TableSettingsContainer.js';

const AddMembers = ({ data, showAddMembersDropdown }) => {
	return (
		<div
			data-id={data.project._id}
			onClick={(e) => showAddMembersDropdown(e)}
			className='table-project__title-members-add-container dropdown'
		>
			<button className='dropdown-button table-project__title-members-add normal-2'>
				<i className='fas fa-user-plus'></i>
				<span>Members</span>
			</button>
			<AddMembersContainer data={data} />
		</div>
	);
};

const Avatar = ({ data }) => {
	return (
		<div className='table-project__title-avatar normal-2'>
			<span>Owner: </span>
			<figure>
				<div className='avatar avatar-global'>
					{!!data && data.project.owner.avatar !== 'no-avatar' ? (
						<img className='normal-3' src={data.project.owner.avatar} alt='avatar' />
					) : (
						<span>{getStringInitials(data.project.owner.name)}</span>
					)}
				</div>
				<figcaption>{data.user.email === data.project.owner.email ? 'You' : data.project.owner.name}</figcaption>
			</figure>
		</div>
	);
};

const Ellipsis = ({ data, showEllipsisDropdown, isCurrentUserOwner }) => {
	return (
		<div onClick={(e) => showEllipsisDropdown(e)} className='dropdown-ellipsis' data-id={data.project._id}>
			<i className='fas fa-ellipsis-v normal-1 dropdown-button'></i>

			<TableSettingsContainer data={data} isCurrentUserOwner={isCurrentUserOwner} />
		</div>
	);
};

/**
 * Main title table.
 */
const TableProjectTitle = ({ data, showEllipsisDropdown, showAddMembersDropdown }) => {
	let isCurrentUserOwner = data.user._id === data.project.owner._id;

	return (
		<div className='table-project__title'>
			<div className='table-project__title-name normal-1'>{data.project.projectName}</div>
			<div className='table-project__title-right'>
				{isCurrentUserOwner && <AddMembers data={data} showAddMembersDropdown={showAddMembersDropdown} />}
				<Avatar data={data} />
				<Ellipsis data={data} showEllipsisDropdown={showEllipsisDropdown} isCurrentUserOwner={isCurrentUserOwner} />
			</div>
		</div>
	);
};

export default TableProjectTitle;
