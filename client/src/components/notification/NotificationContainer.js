import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';

// import Moment from 'moment';

// ui
import Notification from './Notifcation.js';

// context
import Context from '../../context/Context.js';
import { SocketContext } from '../../context/SocketContext.js';
import { GetAllProjectAction } from '../../context/actions/project/ProjectAction.js';

import {
	GetAllNotifications,
	PushNotification,
	UpdateNotification,
	// RemoveNotification,
} from '../../context/actions/user/NotificationAction.js';

// helper
// import axiosInstance from '../../helper/axiosInstance.js';
import Query from '../../helper/query.js';

const NotificationContainer = () => {
	const [notifCount, setNotifCount] = useState(0);
	const [notificationData, setNotificationData] = useState([]);
	const [isAlreadyClicked, setIsAlreadyClicked] = useState(false);
	const [isAcceptLoading, setIsAcceptLoading] = useState(false);
	const [isDeclineLoading, setIsDeclineLoading] = useState(false);

	const params = useParams();
	const history = useHistory();

	const socket = useContext(SocketContext);
	const { projectDispatch } = useContext(Context);
	const {
		userState: {
			user: { data },
		},
	} = useContext(Context);
	const {
		notificationState: { notifications },
		notificationDispatch,
	} = useContext(Context);

	//#region notification bell logic
	const notifBellClickHandler = () => {
		let bellSvg = Query.notificationBellSvg();
		let notificationDropdown = Query.notificationDropdown();
		let miniBell = Query.notifcationMiniBell();

		notificationDropdown.classList.toggle('hide');
		bellSvg.classList.toggle('active');

		if (notifCount > 0) miniBell.classList.toggle('animate');
	};

	useEffect(() => {
		let bellSvgWrapper = Query.notificationBellSvgWrapper();
		let miniBell = Query.notifcationMiniBell();

		let notifReadCount =
			notificationData.length !== 0 &&
			notificationData.filter((notification) => {
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
	}, [notifCount, notificationData]);

	//#endregion

	//#region functions used on socket notificaions logic
	const getAllNotifications = useCallback(() => {
		let id = data?._id;

		data && GetAllNotifications(id)(notificationDispatch);
	}, [data, notificationDispatch]);

	const responseForDeletedProject = useCallback(
		(result, emailToNotif) => {
			if (data) {
				let currentUserEmail = data?.email;

				emailToNotif.forEach((email) => {
					if (email === currentUserEmail) {
						let currentUserParams = params.userid;
						let path = history.location.pathname;
						let toPush = `/${currentUserParams}/dashboard`;

						let projectPath = path.substring(path.lastIndexOf('/') + 1);
						if (projectPath === result.project._id) history.push(toPush);
					}
				});
			}
			GetAllProjectAction()(projectDispatch);
			getAllNotifications();
		},
		[data, history, params.userid, projectDispatch, getAllNotifications]
	);

	const responseForRemovedMember = useCallback(
		(result, emailToNotif) => {
			if (data) {
				let currentUserEmail = data?.email;
				if (emailToNotif === currentUserEmail) {
					PushNotification(result)(notificationDispatch);

					let currentUserParams = params.userid;
					let path = history.location.pathname;
					let toPush = `/${currentUserParams}/dashboard`;

					let projectPath = path.substring(path.lastIndexOf('/') + 1);

					projectPath === result.project._id && history.push(toPush);
				}
			}
			GetAllProjectAction()(projectDispatch);
			getAllNotifications();
		},
		[data, history, params.userid, notificationDispatch, getAllNotifications, projectDispatch]
	);

	const userPushNotification = useCallback(
		(result, emailToNotif) => {
			data && data?.email === emailToNotif && PushNotification(result)(notificationDispatch);

			GetAllProjectAction()(projectDispatch);
			getAllNotifications();
		},
		[data, notificationDispatch, projectDispatch, getAllNotifications]
	);

	//#endregion

	//#region socket notification logic.
	useEffect(() => {
		getAllNotifications();
	}, [getAllNotifications]);

	useEffect(() => {
		notifications && setNotificationData(notifications.data);
	}, [notificationData, notifications]);

	useEffect(() => {
		socket.on('rcv_notif', (content) => {
			let { emailToNotif, result, originalData } = content;
			let { notifType } = originalData;

			if (notifType === 'inviteMembers') {
				userPushNotification(result, emailToNotif);
			} else if (notifType === 'deleteProject') {
				responseForDeletedProject(result, emailToNotif);
			} else if (notifType === 'acceptInvite' || notifType === 'declineInvite') {
				userPushNotification(result, emailToNotif);
			} else if (notifType === 'removedMember') {
				responseForRemovedMember(result, emailToNotif);
			}

			setIsAlreadyClicked(false);
		});

		return () => {
			socket.off('rcv_notif');
		};
	}, [
		socket,
		userPushNotification,
		getAllNotifications,
		responseForRemovedMember,
		responseForDeletedProject,
		projectDispatch,
	]);

	//#endregion

	//#region notification accept and decline logic.
	const acceptClickHandler = (e) => {
		let projectId = e.target.dataset.pid;
		let projectName = e.target.dataset.pname;
		let notificationId = e.target.dataset.nid;
		let senderEmail = e.target.dataset.senderemail;
		let type = 'accepted';
		let response = 'accepted';
		let notifType = 'acceptInvite';

		let currentUser = {
			_id: data?._id,
			name: data?.name,
			email: data?.email,
			avatar: data?.avatar,
		};

		if (isAlreadyClicked !== true) {
			sendInviteResponse(currentUser, senderEmail, response, projectName, projectId, notifType, type, notificationId);
		}
	};

	const declineClickHandler = (e) => {
		let projectId = e.target.dataset.pid;
		let projectName = e.target.dataset.pname;
		let notificationId = e.target.dataset.nid;
		let senderEmail = e.target.dataset.senderemail;
		let type = 'declined';
		let response = 'declined';
		let notifType = 'declineInvite';

		let currentUser = {
			_id: data?._id,
			name: data?.name,
			email: data?.email,
			avatar: data?.avatar,
		};
		if (isAlreadyClicked !== true) {
			sendInviteResponse(currentUser, senderEmail, response, projectName, projectId, notifType, type, notificationId);
		}
	};

	const sendInviteResponse = (
		currentUser,
		senderEmail,
		response,
		projectName,
		projectId,
		notifType,
		type,
		notificationId
	) => {
		setIsAlreadyClicked(true);

		let emailToNotif = senderEmail;

		let dataToPush = {
			sender: currentUser,
			type,
			response,
			projectName,
			_pid: projectId,
		};

		socket.emit('send_notif', { emailToNotif, dataToPush, notifType, notificationId });
		getAllNotifications();
	};

	//#endregion

	//#region clickable update events
	const notifSectionClickHandler = (e) => {
		let type = e.currentTarget.dataset.type;
		let notificationId = e.currentTarget.dataset.nid;

		let formatToUdpdate = {
			_nid: notificationId,
			update: {
				hasRead: true,
			},
		};

		if (type !== 'invite') {
			UpdateNotification(formatToUdpdate)(notificationDispatch);
		}
	};

	// const markAllClickHandler = (e) => {
	// 	// let current = e.currentTarget;
	// 	// let dropdownContentQuery = Query.dropdownContentSelect();
	// 	// dropdownContentQuery.classList.toggle('active');
	// 	// current.classList.toggle('active');
	// };

	//#endregion

	return (
		<Notification
			notifBellClickHandler={notifBellClickHandler}
			notifCount={notifCount}
			notifications={notificationData}
			// markAllClickHandler={markAllClickHandler}
			acceptClickHandler={acceptClickHandler}
			declineClickHandler={declineClickHandler}
			notifSectionClickHandler={notifSectionClickHandler}
			notificationIsLoading={notifications.isLoading}
		/>
	);
};

export default NotificationContainer;
