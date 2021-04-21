import React from 'react';
import Picker from 'emoji-picker-react';
import Dropzone from 'react-dropzone';

const ChatFooter = ({
	emojiPickerActiveClickHandler,
	onEmojiClick,
	inputChangeHandler,
	message,
	messageFormSubmitHandler,
	dropzoneClickHandler,
	uploadError,
	isBtnDisable,
	uploading,
	uploadPercent,
}) => {
	let pickerGroupNames = {
		smileys_people: 'faces',
		animals_nature: 'animals/nature',
		food_drink: 'foods',
		travel_places: 'travels',
		activities: 'activities',
		objects: 'objects',
		symbols: 'symbols',
		flags: 'flags',
		recently_used: 'recent',
	};

	let pickerGroupVisibility = {
		flags: false,
		animals_nature: false,
		objects: true,
		symbols: false,
		recently_used: true,
		travel_places: true,
		activities: true,
		food_drink: true,
	};

	// let isMessageEmpty = !!message.filter((x) => x.trim()).length;

	return (
		<div className='chat-footer'>
			{uploadError && <span>{uploadError}</span>}
			<div
				className={`chat-footer-upload-percent ${uploading ? 'loading' : uploadPercent === 100 ? 'completed' : ''} `}
			></div>
			<form className='chat-footer-message normal-2' onSubmit={(e) => messageFormSubmitHandler(e)}>
				<div className='chat-footer-message__input normal-1'>
					<input
						value={message && message.join('')}
						placeholder='Say something ...'
						onChange={(e) => inputChangeHandler(e)}
						className='chat-footer-message__input-text normal-2'
						type='text'
					/>
					<div onClick={emojiPickerActiveClickHandler} className='chat-footer-message__input-emoji'>
						<i className='fas fa-smile-beam'></i>
						<Picker
							onEmojiClick={onEmojiClick}
							disableSearchBar={true}
							native={true}
							groupNames={pickerGroupNames}
							groupVisibility={pickerGroupVisibility}
						/>
					</div>
					<Dropzone onDrop={(e) => dropzoneClickHandler(e)}>
						{({ getRootProps, getInputProps }) => (
							<section>
								<div {...getRootProps()}>
									<input {...getInputProps()} />
									<i className='chat-footer-message__input-attachment fas fa-paperclip'></i>
								</div>
							</section>
						)}
					</Dropzone>
				</div>
				<button disabled={isBtnDisable} type='submit' className='chat-footer-message__send normal-2'>
					<i className='fas fa-paper-plane'></i>
				</button>
			</form>
		</div>
	);
};

export default ChatFooter;
