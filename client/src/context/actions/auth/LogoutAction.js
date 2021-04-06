import { LOGOUT_USER } from '../../../constants/actionTypes/ActionTypes.js';

export const LogoutAction = () => (dispatch) => {
	localStorage.removeItem('jwt_token');
	dispatch({
		type: LOGOUT_USER,
	});
};
