import React from 'react';
import { GoogleLogout } from 'react-google-login';

// assets
import { ReactComponent as Logo } from '../../assets/svg/logo-svg.svg';

// components
import NotificationContainer from '../notification/NotificationContainer.js';

// constants
import { GOOGLE_CLIENT_ID } from '../../constants/Config';

const Navbar = ({ logoutClickHandler }) => {
	return (
		<nav className='navbar'>
			<div className='navbar-wrapper'>
				<Logo className='navbar__logo' width='5rem' height='5rem' />
				<div className='navbar__right'>
					<NotificationContainer />

					<GoogleLogout
						clientId={GOOGLE_CLIENT_ID}
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
