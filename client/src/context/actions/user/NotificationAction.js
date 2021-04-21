import axiosInstance from '../../../helper/axiosInstance.js';
import {
	NOTIFICATION_LOADING,
	NOTIFICATION_GET,
	NOTIFICATION_CREATE,
	NOTIFICATION_REMOVE,
	NOTIFICATION_UPDATE,
	NOTIFICATION_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

/**
 * get notifications
 */
export const GetAllNotifications = (id) => async (notificationDispatch) => {
	try {
		notificationDispatch({
			type: NOTIFICATION_LOADING,
		});

		let notifications = await axiosInstance().get(`/user/${id}/notifications`);

		notificationDispatch({
			type: NOTIFICATION_GET,
			payload: notifications.data,
		});
	} catch (err) {
		notificationDispatch({
			type: NOTIFICATION_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * push notification.
 */
export const PushNotification = (content) => async (notificationDispatch) => {
	try {
		notificationDispatch({
			type: NOTIFICATION_LOADING,
		});
		console.log(content);
		notificationDispatch({
			type: NOTIFICATION_CREATE,
			payload: content,
		});
	} catch (err) {
		notificationDispatch({
			type: NOTIFICATION_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * remove notifications
 */
export const RemoveNotification = (nid) => async (notificationDispatch) => {
	try {
		notificationDispatch({
			type: NOTIFICATION_LOADING,
		});

		await axiosInstance().delete(`/user/notification/remove/${nid}`);

		notificationDispatch({
			type: NOTIFICATION_REMOVE,
			payload: nid,
		});
	} catch (err) {
		notificationDispatch({
			type: NOTIFICATION_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * update notification
 */
export const UpdateNotification = (input) => async (notificationDispatch) => {
	try {
		notificationDispatch({
			type: NOTIFICATION_LOADING,
		});

		let updatedNotification = await axiosInstance().put('/user/notification/update', input);

		notificationDispatch({
			type: NOTIFICATION_UPDATE,
			payload: updatedNotification.data,
		});
	} catch (err) {
		notificationDispatch({
			type: NOTIFICATION_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
