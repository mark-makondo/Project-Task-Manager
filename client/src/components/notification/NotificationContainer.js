import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';

// ui
import Notification from './Notifcation.js';

// context
import Context from '../../context/Context.js';
import { SocketContext } from '../../context/SocketContext.js';
import { GetAllProjectAction } from '../../context/actions/project/ProjectAction.js';
import { ProjectMembersGetAction } from '../../context/actions/project/ProjectMembersAction';

import {
	GetAllNotifications,
	PushNotification,
	UpdateNotification,
} from '../../context/actions/user/NotificationAction.js';

// helper
import Query from '../../helper/query.js';

const NotificationContainer = () => {
	const [notifCount, setNotifCount] = useState(0);
	const [notificationData, setNotificationData] = useState([]);
	const [isAlreadyClicked, setIsAlreadyClicked] = useState(false);

	const params = useParams();
	const history = useHistory();

	const socket = useContext(SocketContext);
	const { projectDispatch, projectMembersDispatch } = useContext(Context);
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
						PushNotification(result)(notificationDispatch);

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
		[data, history, params.userid, projectDispatch, getAllNotifications, notificationDispatch]
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

	const responseForAcceptedOrDeclinedMember = useCallback(
		(result, emailToNotif) => {
			if (data?.email === emailToNotif) {
				PushNotification(result)(notificationDispatch);
				ProjectMembersGetAction(result.project._id)(projectMembersDispatch);
			}
		},
		[data, notificationDispatch, projectMembersDispatch]
	);

	const userPushNotification = useCallback(
		(result, emailToNotif) => {
			if (data?.email === emailToNotif) {
				PushNotification(result)(notificationDispatch);
			}
		},
		[data, notificationDispatch]
	);

	//#endregion

	//#region socket notification logic.
	useEffect(() => {
		data && data.notifications.length !== 0 && getAllNotifications();
	}, [getAllNotifications, data]);

	useEffect(() => {
		notifications && setNotificationData(notifications.data);
	}, [notificationData, notifications]);

	useEffect(() => {
		socket.on('rcv_notif', (content) => {
			let { emailToNotif, result, originalData } = content;
			let { notifType } = originalData;

			if (notifType === 'inviteMembers') {
				userPushNotification(result, emailToNotif);
			} else if (notifType === 'acceptInvite' || notifType === 'declineInvite') {
				responseForAcceptedOrDeclinedMember(result, emailToNotif);
			} else if (notifType === 'deleteProject') {
				responseForDeletedProject(result, emailToNotif);
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
		responseForAcceptedOrDeclinedMember,
	]);

	useEffect(() => {
		socket.on('status', (statusData) => {
			let { statusType, success } = statusData;

			statusType === 'members_updated_broadcast_to_self' && success && GetAllProjectAction()(projectDispatch);
		});
		return () => {
			socket.off('status');
		};
	}, [socket, projectDispatch, projectMembersDispatch]);

	useEffect(() => {
		socket.on('members_updated_broadcast_to_owner', (statusData) => {
			let { success, emailToNotif, _pid } = statusData;

			emailToNotif === data?.email && success && ProjectMembersGetAction(_pid)(projectMembersDispatch);
		});

		return () => {
			socket.off('members_updated_broadcast_to_owner');
		};
	}, [socket, projectMembersDispatch, data?.email]);
	//#endregion

	//#region notification accept and decline logic.
	const acceptClickHandler = async (e) => {
		let projectId = e.target.dataset.pid;
		let projectName = e.target.dataset.pname;
		let notificationId = e.target.dataset.nid;
		let senderEmail = e.target.dataset.senderemail;
		let type = 'accepted';
		let response = 'accepted';
		let notifType = 'acceptInvite';

		if (isAlreadyClicked !== true) {
			await sendInviteResponse(senderEmail, response, projectName, projectId, notifType, type, notificationId);
		}
	};

	const declineClickHandler = async (e) => {
		let projectId = e.target.dataset.pid;
		let projectName = e.target.dataset.pname;
		let notificationId = e.target.dataset.nid;
		let senderEmail = e.target.dataset.senderemail;
		let type = 'declined';
		let response = 'declined';
		let notifType = 'declineInvite';

		if (isAlreadyClicked !== true) {
			await sendInviteResponse(senderEmail, response, projectName, projectId, notifType, type, notificationId);
		}
	};

	const sendInviteResponse = async (
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

		let currentUser = {
			_id: data?._id,
			name: data?.name,
			email: data?.email,
			avatar: data?.avatar,
		};

		let dataToPush = {
			sender: currentUser,
			type,
			response,
			projectName,
			_pid: projectId,
		};

		socket.emit('send_notif', { emailToNotif, dataToPush, notifType, notificationId });

		let formatToUdpdate = {
			_nid: notificationId,
			update: {
				hasRead: true,
				response,
			},
		};
		await UpdateNotification(formatToUdpdate)(notificationDispatch);
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
