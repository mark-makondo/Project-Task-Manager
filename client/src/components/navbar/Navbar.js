import React from 'react';

// assets
import { ReactComponent as Logo } from '../../assets/svg/logo-svg.svg';

// components
import NotificationContainer from '../notification/NotificationContainer.js';

const Navbar = () => {
	return (
		<nav className='navbar'>
			<div className='navbar-wrapper'>
				<Logo className='navbar__logo' width='5rem' height='5rem' />
				<div className='navbar__right'>
					<NotificationContainer />
					<button className='normal-2'>Logout</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
