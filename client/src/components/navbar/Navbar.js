import React from 'react';
import { GoogleLogout } from 'react-google-login';

// assets
import { ReactComponent as Logo } from '../../assets/svg/logo-svg.svg';

// components
import NotificationContainer from '../notification/NotificationContainer.js';

const Navbar = ({ logoutClickHandler }) => {
	const clientId =
		'934331962195-0k9qksgpq7j703f84o6ocf6t0unps4ll.apps.googleusercontent.com';
	return (
		<nav className='navbar'>
			<div className='navbar-wrapper'>
				<Logo className='navbar__logo' width='5rem' height='5rem' />
				<div className='navbar__right'>
					<NotificationContainer />

					<GoogleLogout
						clientId={clientId}
						buttonText='Logout'
						render={(renderProps) => (
							<button
								onClick={renderProps.onClick}
								disabled={renderProps.disabled}
								className='navbar__right-logout normal-2'
							>
								Logout
							</button>
						)}
						onLogoutSuccess={logoutClickHandler}
					></GoogleLogout>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
