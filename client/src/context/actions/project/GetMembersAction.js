import axiosInstance from '../../../helper/axiosInstance.js';

import {
	GET_MEMBERS_LOADING,
	GET_MEMBERS_SUCCESS,
	GET_MEMBERS_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

export const GetMembersAction = (pid) => async (membersDispatch) => {
	try {
		membersDispatch({
			type: GET_MEMBERS_LOADING,
		});

		let res = await axiosInstance().get(`/project/member/findAll/${pid}`);

		membersDispatch({
			type: GET_MEMBERS_SUCCESS,
			payload: res.data,
		});
	} catch (err) {
		membersDispatch({
			type: GET_MEMBERS_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
