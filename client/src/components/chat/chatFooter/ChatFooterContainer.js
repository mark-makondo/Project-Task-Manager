import React, { useState, useContext } from 'react';
import moment from 'moment';

// ui
import ChatFooter from './ChatFooter.js';

// helper
import Query from '../../../helper/query.js';
import AxiosInstance from '../../../helper/axiosInstance.js';

// context
import { SocketContext } from '../../../context/SocketContext.js';

const ChatFooterContainer = ({ data }) => {
	const [message, setMessage] = useState([]);

	const [image, setImage] = useState();

	const socket = useContext(SocketContext);

	const onEmojiClick = (event, emojiObject) => {
		setMessage([...message, emojiObject.emoji]);
	};

	const emojiPickerActiveClickHandler = (e) => {
		e.preventDefault();
		Query.emojiPickerReact().classList.toggle('active');
	};

	const inputChangeHandler = (e) => {
		e.preventDefault();

		setMessage([e.target.value]);
	};

	const messageFormSubmitHandler = (e) => {
		e.preventDefault();

		let _tid = localStorage.getItem('local-tid');
		let msg = message.join(' ');

		let messageformat = {
			_id: data?.user._id,
			_tid,
			content: {
				message: msg,
				dateCreated: moment(),
				type: 'text',
			},
		};

		socket.emit('send_message', messageformat);
	};

	const dropzoneClickHandler = async (files) => {
		let _tid = localStorage.getItem('local-tid');

		let formData = new FormData();

		const config = {
			headers: { 'content-type': 'multipart/form-data' },
		};
		formData.append('file', files[0]);
		// console.log(URL.createObjectURL(files[0]));
		// setImage(URL.createObjectURL(files[0]));

		let res = await AxiosInstance().post('/project/task/fileupload', formData, config);
		let fileData = res.data.url;
		// let fileMimetype = res.data.url.mimetype;

		if (res.data.success) {
			let messageformat = {
				_id: data?.user._id,
				_tid,
				content: {
					message: fileData,
					dateCreated: moment(),
					type: 'image',
				},
			};
			socket.emit('send_message', messageformat);
		}
	};
	return (
		<ChatFooter
			message={message}
			inputChangeHandler={inputChangeHandler}
			emojiPickerActiveClickHandler={emojiPickerActiveClickHandler}
			onEmojiClick={onEmojiClick}
			messageFormSubmitHandler={messageFormSubmitHandler}
			dropzoneClickHandler={dropzoneClickHandler}
		/>
	);
};

export default ChatFooterContainer;
