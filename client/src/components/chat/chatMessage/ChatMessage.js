import React from 'react';
import Moment from 'react-moment';

// constants
import { BACKEND_SERVER } from '../../../constants/SocketConnection.js';

// helper
import { getStringInitials } from '../../../helper/helperFunctions.js';

const ChatMessage = ({ message, data }) => {
	let authorid = message.author._id;
	let msg = message.message;
	let name = message.author.name;
	let avatar = message.author.avatar;
	let date = message.dateCreated;

	let isAuthorIsEqualToUser = data?.user._id === authorid;

	let margin = {
		marginLeft: isAuthorIsEqualToUser && 'auto',
	};

	let display = {
		display: isAuthorIsEqualToUser && 'none',
	};
	let borderRadius = {
		borderRadius: isAuthorIsEqualToUser && '1rem 2rem 0rem 1rem',
	};

	const TextMessage = () => {
		return (
			<>
				<span style={display} className='chat-message__name' title={name}></span>
				<span title={isAuthorIsEqualToUser ? 'You' : name}>
					<p className='chat-message__content '>{msg}</p>
				</span>
			</>
		);
	};

	const ImageMessage = () => {
		return <img width='200' src={`${BACKEND_SERVER}/uploads/${msg}`} alt={`${msg} jpg`}></img>;
	};

	return (
		<div className='chat-message normal-3'>
			<div style={margin} className='chat-message-wrapper'>
				<div className='chat-message-wrapper-left'>
					<div style={display} className='chat-message__avatar'>
						{avatar !== 'no-avatar' ? (
							<img className='normal-3' src={avatar} alt='avatar' />
						) : (
							<span title={name}>{getStringInitials(name)}</span>
						)}
					</div>
				</div>
				<div className='chat-message-wrapper-right'>
					<div style={borderRadius} className='chat-message-divided'>
						{message.type === 'image' ? <ImageMessage /> : <TextMessage />}
					</div>

					<span style={margin} className='chat-message__date '>
						<Moment fromNow>{date}</Moment>
					</span>
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
