import React, { useEffect, useState, useContext, useCallback } from 'react';
import Moment from 'moment';

// ui
import Notification from './Notifcation.js';

// context
import Context from '../../context/Context.js';
import { SocketContext } from '../../context/SocketContext.js';
import { GetAllProjectAction } from '../../context/actions/project/GetAllProjectAction.js';

// helper
import AxiosInstance from '../../helper/axiosInstance.js';
import Query from '../../helper/query.js';

const NotificationContainer = () => {
	const [notifCount, setNotifCount] = useState(0);
	const [notifications, setNotifications] = useState([]);

	const socket = useContext(SocketContext);
	const {
		userState: {
			user: { data },
		},
	} = useContext(Context);

	const { projectDispatch } = useContext(Context);

	//#region notification bell logic
	const notifBellClickHandler = () => {
		let bellSvg = Query.notificationBellSvg();
		let notification = Query.notificationDropdown();
		let miniBell = Query.notifcationMiniBell();

		notification.classList.toggle('hide');
		bellSvg.classList.toggle('active');

		if (notifCount > 0) miniBell.classList.toggle('animate');
	};

	useEffect(() => {
		let bellSvgWrapper = Query.notificationBellSvgWrapper();
		let miniBell = Query.notifcationMiniBell();

		let notifReadCount = notifications.filter((notification) => {
			return notification.hasRead !== true;
		}).length;

		setNotifCount(notifReadCount);

		let notifDataCount = bellSvgWrapper.dataset.count;

		if (notifDataCount > 0) {
			bellSvgWrapper.classList.add('show-count');
			miniBell.classList.add('animate');
		} else {
			bellSvgWrapper.classList.remove('show-count');
			miniBell.classList.remove('animate');
		}
	}, [notifCount, notifications]);

	//#endregion

	//#region socket notification logic
	const getNotifications = useCallback(async () => {
		let currentUserId = data?._id;
		if (currentUserId) {
			let { data } = await AxiosInstance().get(`/user/notifications/${currentUserId}`);
			setNotifications(data);
		}
	}, [data?._id]);

	useEffect(() => {
		let currentUserEmail = data?.email;

		socket.on('received_notification', (data) => {
			if (currentUserEmail !== data.sender.email) {
				setNotifications([...notifications, data]);
			}
		});

		return () => {
			socket.off('received_notification');
		};
	}, [socket, data?.email, notifications]);

	useEffect(() => {
		getNotifications();
	}, [getNotifications]);

	useEffect(() => {
		let currentUserId = data?._id;

		socket.on('status', (data) => {
			if (currentUserId === data.senderId) {
				getNotifications();
			}
		});

		return () => {
			socket.off('status');
		};
	}, [socket, getNotifications, data?._id]);

	//#endregion

	//#region notification header logic.
	const markAllClickHandler = (e) => {
		// let current = e.currentTarget;
		// let dropdownContentQuery = Query.dropdownContentSelect();
		// dropdownContentQuery.classList.toggle('active');
		// current.classList.toggle('active');
	};

	// #endregion

	//#region notification sections logic
	const acceptClickHandler = (e) => {
		let projectId = e.target.dataset.pid;
		let projectName = e.target.dataset.pname;
		let notificationId = e.target.dataset.nid;
		let senderEmail = e.target.dataset.senderemail;
		let response = 'accepted';
		let sendResponsetype = 'accepted';

		let currentUser = {
			_id: data?._id,
			name: data?.name,
			email: data?.email,
			avatar: data?.avatar,
		};

		updateNotificationAndAddToMembers(currentUser, projectId, notificationId, response);
		sendNotificationToAuthor(currentUser, senderEmail, projectName, projectId, sendResponsetype);
	};

	const declineClickHandler = (e) => {
		let projectId = e.target.dataset.pid;
		let projectName = e.target.dataset.pname;
		let notificationId = e.target.dataset.nid;
		let senderEmail = e.target.dataset.senderemail;
		let response = 'declined';
		let sendResponsetype = 'declined';

		let currentUser = {
			_id: data?._id,
			name: data?.name,
			email: data?.email,
			avatar: data?.avatar,
		};

		updateNotificationAndAddToMembers(currentUser, projectId, notificationId, response);
		sendNotificationToAuthor(currentUser, senderEmail, projectName, projectId, sendResponsetype);
	};

	/**
	 * update the current user notification box if he/she accepted or declined
	 * the invitations and if accepted the user will be added to the project
	 * collection of the author of the corresponding notification.
	 */
	const updateNotificationAndAddToMembers = (currentUser, projectId, notificationId, response) => {
		let formatToSend = {
			currentUser,
			projectId,
			notificationId,
			response,
		};

		socket.emit('send_notification_response', { sendType: 'updateMemberStatus', data: formatToSend });
	};

	/**
	 * send a notification to the author of the notification if it was accepted
	 * or not.
	 */
	const sendNotificationToAuthor = (currentUser, senderEmail, projectName, projectId, sendResponsetype) => {
		let emailToSend = senderEmail;
		let sentDate = Moment();

		let formatToSend = {
			type: sendResponsetype,
			emailToInvite: emailToSend,
			senderData: currentUser,
			sentDate,
			project: {
				projectId,
				projectName,
			},
		};

		socket.emit('send_notification', { sendType: 'reply', data: formatToSend });
	};

	/**
	 * update only the non-invite type notifications.
	 */
	const notifSectionClickHandler = (e) => {
		let type = e.currentTarget.dataset.type;
		let notificationId = e.currentTarget.dataset.nid;

		if (type !== 'invite') {
			let formatToSend = {
				currentUser: {
					_id: data?._id,
				},
				notificationId,
				response: 'none',
			};
			socket.emit('send_notification_response', { sendType: 'updateNotification', data: formatToSend });
		}
	};

	/**
	 * dispatch getallproject state to get the updated projects of the current
	 * user when the update is done.
	 */
	useEffect(() => {
		let currentUserId = data?._id;

		socket.on('status', (data) => {
			if (currentUserId === data.senderId) {
				data.sendType && data.sendType === 'membersUpdated' && GetAllProjectAction()(projectDispatch);
			}
		});

		return () => {
			socket.off('status');
		};
	}, [socket, data?._id, projectDispatch]);

	//#endregion

	return (
		<Notification
			notifBellClickHandler={notifBellClickHandler}
			notifCount={notifCount}
			notifications={notifications}
			markAllClickHandler={markAllClickHandler}
			acceptClickHandler={acceptClickHandler}
			declineClickHandler={declineClickHandler}
			notifSectionClickHandler={notifSectionClickHandler}
		/>
	);
};

export default NotificationContainer;
