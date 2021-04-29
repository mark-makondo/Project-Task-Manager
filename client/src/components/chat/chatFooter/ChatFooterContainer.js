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
	const [uploading, setUploading] = useState(false);
	const [uploadPercent, setUploadPercent] = useState(0);

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

	const sendMessageAndPost = async (_tid, messageformat) => {
		try {
			let messageFormatToEmit = {
				_tid,
				content: {
					_id: data?.user._id,
					...messageformat.content,
					author: data?.user,
					url: '',
				},
			};

			socket.emit('send_message', messageFormatToEmit);

			await AxiosInstance().post('/project/task/message/add', messageformat);
		} catch (error) {
			console.error(error);
		}
	};

	const messageFormSubmitHandler = async (e) => {
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

		sendMessageAndPost(_tid, messageformat);
		setMessage('');
	};

	const dropzoneClickHandler = async (files) => {
		let _tid = localStorage.getItem('local-tid');

		let formData = new FormData();

		const config = {
			headers: { 'content-type': 'multipart/form-data' },
		};

		formData.append('file', files[0]);
		formData.append('_tid', _tid);
		formData.append('_pid', data?.project._id);

		try {
			setUploading(true);
			setUploadPercent(50);
			let res = await AxiosInstance().post('/project/task/fileupload', formData, config);
			let isImage = res.data.isImage;
			setUploading(false);
			setUploadPercent(100);

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
				sendMessageAndPost(_tid, messageformat);
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
				sendMessageAndPost(_tid, messageformat);
			}
		} catch (error) {
			// console.error(error);
			if (error) setUploadError(error.response.data);
			setUploading(false);
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
			uploading={uploading}
			uploadPercent={uploadPercent}
		/>
	);
};

export default ChatFooterContainer;
