import axiosInstance from '../../../helper/axiosInstance.js';

import {
	REMOVE_MEMBERS_LOADING,
	REMOVE_MEMBERS_SUCCESS,
	REMOVE_MEMBERS_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const RemoveMembersAction = (input) => async (membersDispatch) => {
	try {
		membersDispatch({
			type: REMOVE_MEMBERS_LOADING,
		});
		let res;
		let pid = input.pid;
		let mid = input.mid;

		let deleteResponse = await axiosInstance().delete(`/project/member/remove/${pid}/${mid}`);
		if (deleteResponse.data.success) res = await axiosInstance().get(`/project/member/findAll/${pid}`);

		membersDispatch({
			type: REMOVE_MEMBERS_SUCCESS,
			payload: res.data,
		});
	} catch (err) {
		membersDispatch({
			type: REMOVE_MEMBERS_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
