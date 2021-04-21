import axiosInstance from '../../../helper/axiosInstance.js';
import {
	PROJECT_MEMBERS_LOADING,
	PROJECT_MEMBERS_ADD,
	PROJECT_MEMBERS_GET,
	PROJECT_MEMBERS_REMOVE,
	PROJECT_MEMBERS_ERROR,
	COULD_NOT_CONNECT,
} from '../../../constants/actionTypes/ActionTypes.js';

/**
 * Get all members.
 */
export const ProjectMembersGetAction = (pid) => async (projectMembersDispatch) => {
	try {
		projectMembersDispatch({
			type: PROJECT_MEMBERS_LOADING,
		});

		let members = await axiosInstance().get(`/project/member/findAll/${pid}`);

		projectMembersDispatch({
			type: PROJECT_MEMBERS_GET,
			payload: members.data,
		});
	} catch (err) {
		projectMembersDispatch({
			type: PROJECT_MEMBERS_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * Add members.
 */
export const ProjectMembersAddAction = (input) => async (projectMembersDispatch) => {
	try {
		projectMembersDispatch({
			type: PROJECT_MEMBERS_LOADING,
		});

		let format = {
			_pid: input._pid,
			memberToInviteEmail: input.memberToInviteEmail,
		};

		let members = await axiosInstance().post('/project/member/add', format);

		projectMembersDispatch({
			type: PROJECT_MEMBERS_ADD,
			payload: members.data,
		});
	} catch (err) {
		projectMembersDispatch({
			type: PROJECT_MEMBERS_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * Remove members.
 */
export const ProjectMembersRemoveAction = (input) => async (projectMembersDispatch) => {
	try {
		projectMembersDispatch({
			type: PROJECT_MEMBERS_LOADING,
		});

		let pid = input.pid;
		let mid = input.mid;

		await axiosInstance().delete(`/project/member/remove/${pid}/${mid}`);

		projectMembersDispatch({
			type: PROJECT_MEMBERS_REMOVE,
			payload: mid,
		});
	} catch (err) {
		projectMembersDispatch({
			type: PROJECT_MEMBERS_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
