import React, { useContext, useEffect, useRef } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';

// helper function
import { decodedJwt } from '../../helper/helperFunctions.js';

// ui
import Navbar from './Navbar.js';

// context actions
import Context from '../../context/Context.js';
import { GetUserInfo } from '../../context/actions/user/GetUserInfo.js';
import { LogoutAction } from '../../context/actions/auth/LogoutAction.js';
import { GetAllProjectAction } from '../../context/actions/project/GetAllProjectAction.js';

const NavbarContainer = () => {
	const { userDispatch } = useContext(Context);
	const { authDispatch } = useContext(Context);
	const { projectDispatch } = useContext(Context);

	const trackChanges = useRef(false);

	const history = useHistory();
	const params = useParams();

	const logoutClickHandler = () => {
		LogoutAction()(authDispatch);
	};

	useEffect(() => {
		if (!trackChanges.current) {
			GetUserInfo(history, params.userid)(userDispatch);
			GetAllProjectAction()(projectDispatch);

			trackChanges.current = true;
		}
	}, [history, params.userid, userDispatch, projectDispatch]);

	if (!decodedJwt().isValid) {
		return <Redirect to='/' />;
	}
	return (
		<>
			<Navbar logoutClickHandler={logoutClickHandler} />
		</>
	);
};

export default NavbarContainer;
