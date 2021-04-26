import React from 'react';
import Moment from 'moment';

// helper functions
import { getStringInitials } from '../../../helper/helperFunctions.js';

const StatusSelect = ({ data, itemClickHandler }) => {
	return (
		<>
			{data &&
				data.map((item, i) => (
					<li
						className='normal-3'
						data-id={item.id}
						key={`${item.data}-${i}`}
						onMouseDown={(e) => itemClickHandler(e)}
						onClick={(e) => itemClickHandler(e)}
					>
						{item.data}
					</li>
				))}
		</>
	);
};

const PersonSelect = ({ data, members, itemClickHandler, tid }) => {
	let projectOwner = data?.project.owner;
	let projectOwnerCreatedAt = data?.project.owner.createdAt;

	let ownerData = {
		_id: projectOwner,
		isAccepted: true,
		joinedDate: Moment(projectOwnerCreatedAt).format('ddd MMM D yy'),
	};

	let membersWithOwner = [...members, ownerData];

	let filteredMembers =
		members &&
		membersWithOwner.filter((member) => {
			return member.joinedDate !== 'pending';
		});

	return (
		<>
			{members &&
				filteredMembers.map((item) => (
					<li
						className='normal-3'
						key={item._id._id}
						data-id={item._id._id}
						data-tid={tid}
						data-name={item._id.name}
						data-email={item._id.email}
						data-avatar={item._id.avatar}
						onMouseDown={(e) => itemClickHandler(e)}
						onClick={(e) => itemClickHandler(e)}
					>
						<div className='person-avatar'>
							{item._id.avatar !== 'no-avatar' ? (
								<img src={item._id.avatar} alt='avatar' />
							) : (
								<span>{getStringInitials(item._id.name)}</span>
							)}
						</div>
						<span className='person-avatar-name normal-3'>{item._id.name.split(' ')[0]}</span>
					</li>
				))}
		</>
	);
};

/**
 * Main select.
 */
const Select = ({ data, members, itemClickHandler, type, tid }) => {
	return (
		<div className={`dropdown-content-select `}>
			{type === '1' ? (
				<StatusSelect data={data} itemClickHandler={itemClickHandler} />
			) : type === '2' ? (
				<PersonSelect data={data} members={members} itemClickHandler={itemClickHandler} tid={tid} />
			) : (
				<span></span>
			)}
		</div>
	);
};

export default Select;
