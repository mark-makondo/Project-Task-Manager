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

const NavbarContainer = () => {
	// use this to store user information and use the state on all dashboard components
	const { userDispatch } = useContext(Context);

	// logout context
	const { authDispatch } = useContext(Context);

	// this is for es lint fix since react doesn't handle object equality
	const trackChanges = useRef();

	const history = useHistory();
	const { userid } = useParams();

	const logoutClickHandler = () => {
		/**
		 * handles google logout through module and normal logout
		 * at the same time by clearing local storage
		 */
		LogoutAction()(authDispatch);
	};

	useEffect(() => {
		if (!trackChanges.current) {
			GetUserInfo(history, userid)(userDispatch);
			trackChanges.current = true;
		}
	}, [history, userid, userDispatch]);

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
