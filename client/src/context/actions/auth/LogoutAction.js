import { LOGOUT_USER } from '../../../constants/actionTypes/ActionTypes.js';

export const LogoutAction = () => (authDispatch) => {
	localStorage.removeItem('jwt_token');
	authDispatch({
		type: LOGOUT_USER,
	});
};
