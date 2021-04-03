import React, { useEffect, useState } from 'react';

// ui
import Notification from './Notifcation.js';

const NotificationContainer = () => {
	const notifMessage = [{ message: 'Section One' }, { message: 'Section Two' }];
	const [bellClicked, setBellClicked] = useState(false);
	const [notifCount, setNotifCount] = useState(0);

	const notifBellClickHandler = () => {
		// let bellWrapper = query('.notif-bell-wrapper');
		let notification = query('.notification');
		let bellSvg = query('.notif-bell');
		let wrapperHide = query('.notif .wrapper');
		// let bellHide = query('.notif-bell .bell');

		toggleClass(wrapperHide, 'hide');
		toggleClass(notification, 'hide');
		toggleClass(bellSvg, 'grey');
		// bellWrapper.classList.remove('show-count');
		// bellHide.classList.remove('animate');
		setBellClicked(true);
	};

	const toggleClass = (el, className) => {
		if (el.classList.contains(className)) {
			el.classList.remove(className);
		} else {
			el.classList.add(className);
		}
	};

	const query = (value) => {
		return document.querySelector(value);
	};

	useEffect(() => {
		setBellClicked(false);
	}, [bellClicked]);

	useEffect(() => {
		setNotifCount(notifMessage.length);
		let bellWrapper = query('.notif-bell-wrapper');
		let insideBell = query('.notif-bell .bell');

		let notifDataCount = bellWrapper.dataset.count;

		// console.log(notifCount);

		if (notifDataCount > 0) {
			bellWrapper.classList.add('show-count');
			insideBell.classList.add('animate');
		} else {
			bellWrapper.classList.remove('show-count');
			insideBell.classList.remove('animate');
		}
	}, [notifCount, notifMessage.length]);

	return (
		<>
			<Notification
				notifBellClickHandler={notifBellClickHandler}
				notifMessage={notifMessage}
			/>
		</>
	);
};

export default NotificationContainer;
