import React from 'react';
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom';

// helper function
import { getStringInitials } from '../../helper/helperFunctions.js';

// dropdown
import NewProjectContainer from '../dropdown/newProject/NewProjectContainer.js';
import ProfileSettingsContainer from '../dropdown/profileSettings/ProfileSettingsContainer.js';

const Sidebar = ({
	collapseClickHandler,
	showProfileSettingsDropdown,
	showCreateProjectDropdown,
	userData,
	projects,
}) => {
	// to prevent 'home' from always being active since home is not 'exact'.
	let match = useRouteMatch();
	let homeUrl = match.url;
	let currentUrl = useHistory().location.pathname;
	let isHome = homeUrl === currentUrl ? 'selected' : '';

	return (
		<aside className='sidebar normal-1'>
			<div className='sidebar-wrapper'>
				<div className='sidebar-top'>
					<div className='sidebar-top__home sidebar-top--title'>
						<NavLink to={homeUrl} activeClassName={isHome} className='title sidebar-hover'>
							home
						</NavLink>
					</div>
					<div className='sidebar-top__overview sidebar-top--title'>
						<NavLink to={`${homeUrl}/project-overview`} activeClassName='selected' className='title sidebar-hover'>
							overview
						</NavLink>
					</div>
					<div className='sidebar-top__projects sidebar-top--title'>
						<span className='title'>
							projects-
							<span className='project-num'>{`(${!!projects && projects.data ? projects.data.length : 0})`}</span>
						</span>
						<ul className='normal-2'>
							{!!projects &&
								projects.data.map((project, i) => (
									<NavLink
										key={`${project._id}-${i}`}
										to={`${homeUrl}/${project._id}`}
										activeClassName='selected'
										className='project-list normal-2 sidebar-hover'
									>
										<span>{project.projectName}</span>
									</NavLink>
								))}
						</ul>
					</div>
					<div onClick={(e) => showCreateProjectDropdown(e)} className='sidebar-top__newProject dropdown'>
						<button className='dropdown-button normal-2'>+ NEW</button>
						<NewProjectContainer />
					</div>
				</div>
				<div className='sidebar-bottom'>
					<div onClick={(e) => showProfileSettingsDropdown(e)} className='sidebar-bottom__profile dropdown'>
						<div className='dropdown-button sidebar-bottom__profile-avatar'>
							{userData && userData?.avatar !== 'no-avatar' ? (
								<img src={userData?.avatar} alt='user data avatar' />
							) : (
								<span>{getStringInitials(userData?.name)}</span>
							)}
						</div>
						<ProfileSettingsContainer />
					</div>
				</div>
			</div>

			<i onClick={(e) => collapseClickHandler(e)} className='sidebar-collapsed fas fa-chevron-circle-left'></i>
		</aside>
	);
};

export default Sidebar;
