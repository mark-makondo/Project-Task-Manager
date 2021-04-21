import React from 'react';
import Moment from 'react-moment';

// helper
import { getStringInitials } from '../../../helper/helperFunctions.js';

export const TopSection = ({ notification }) => {
	let { type, sender, project, dateReceived } = notification;
	let { name, avatar } = sender;

	let isTypeInvite = type === 'invite';
	let isTypeAssign = type === 'assign';
	let isTypeAccepted = type === 'accepted';
	let isTypeDeclined = type === 'declined';
	let isTypeDeleted = type === 'deleted';
	let isTypeRemoved = type === 'removed';

	const Message = ({ name, content, projectName }) => {
		return (
			<p className='section-top__content-message'>
				<span className='highlight'>{name} </span>
				{content}
				<span className='highlight'>{projectName}.</span>
			</p>
		);
	};

	return (
		<div className='section-top'>
			<div className='section-top__avatar'>
				{avatar !== 'no-avatar' ? (
					<img className='normal-2' src={avatar} alt='avatar' width='70' />
				) : (
					<span>{getStringInitials(name)}</span>
				)}
			</div>
			<div className='section-top__content'>
				{isTypeInvite ? (
					<Message name={name} content='invited you to a project: ' projectName={project.projectName} />
				) : isTypeAssign ? (
					<Message name={name} content='assigned you to a task in: ' projectName={project.projectName} />
				) : isTypeAccepted ? (
					<Message name={name} content='accepted your invitation for ' projectName={project.projectName} />
				) : isTypeDeclined ? (
					<Message name={name} content='declined your invitation for ' projectName={project.projectName} />
				) : isTypeDeleted ? (
					<Message name={name} content='deleted ' projectName={project.projectName} />
				) : isTypeRemoved ? (
					<Message name={name} content='removed you from ' projectName={project.projectName} />
				) : (
					<p></p>
				)}
				<div className='section-top__content-date normal-3'>
					<Moment fromNow>{dateReceived}</Moment>
				</div>
			</div>

			<i className='section-top__active-identifier fas fa-circle'></i>
		</div>
	);
};
