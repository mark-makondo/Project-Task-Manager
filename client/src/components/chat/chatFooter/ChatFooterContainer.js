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

	const [uploadError, setUploadError] = useState(null);

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
			onUploadProgress: (progressEvent) => console.log(progressEvent.loaded),
		};

		formData.append('file', files[0]);
		formData.append('_tid', _tid);
		formData.append('_pid', data?.project._id);

		try {
			let res = await AxiosInstance().post('/project/task/fileupload', formData, config);

			let isImage = res.data.isImage;

			if (isImage) {
				let { url } = res.data;

				let messageformat = {
					_id: data?.user._id,
					_tid,
					content: {
						message: url,
						dateCreated: moment(),
						type: 'image',
					},
				};
				socket.emit('send_message', messageformat);
			} else {
				let { originalname, publicUrl } = res.data;

				let messageformat = {
					_id: data?.user._id,
					_tid,
					content: {
						message: originalname,
						dateCreated: moment(),
						type: 'others',
						url: publicUrl.webContentLink,
					},
				};
				socket.emit('send_message', messageformat);
			}
		} catch (error) {
			// console.error(error);
			if (error) setUploadError(error.response.data);
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
			uploadError={uploadError}
		/>
	);
};

export default ChatFooterContainer;
