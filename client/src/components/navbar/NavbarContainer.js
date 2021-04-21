import React, { useContext, useEffect } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';

// helper function
import { decodedJwt } from '../../helper/helperFunctions.js';

// ui
import Navbar from './Navbar.js';

// context actions
import Context from '../../context/Context.js';
import { GetUserInfo } from '../../context/actions/user/GetUserInfo.js';
import { LogoutAction } from '../../context/actions/auth/LogoutAction.js';
import { GetAllProjectAction } from '../../context/actions/project/ProjectAction.js';

const NavbarContainer = () => {
	const { userDispatch } = useContext(Context);
	const { authDispatch } = useContext(Context);
	const { projectDispatch } = useContext(Context);

	const history = useHistory();
	const params = useParams();

	const logoutClickHandler = () => {
		LogoutAction()(authDispatch);
	};

	useEffect(() => {
		GetAllProjectAction()(projectDispatch);
	}, [projectDispatch]);

	useEffect(() => {
		GetUserInfo(history, params.userid)(userDispatch);
	}, [history, params.userid, userDispatch]);

	if (!decodedJwt().isValid) {
		return <Redirect to='/' />;
	}
	return <Navbar logoutClickHandler={logoutClickHandler} />;
};

export default NavbarContainer;
