import React from 'react';
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom';

// helper function
import { getStringInitials } from '../../helper/helperFunctions.js';
import { ToggleArrow } from '../../helper/helperFunctions.js';

// dropdown
import NewProjectContainer from '../dropdown/newProject/NewProjectContainer.js';
import UserSettingsContainer from '../dropdown/userSettings/UserSettingsContainer.js';

const Sidebar = ({
	collapseClickHandler,
	showProfileSettingsDropdown,
	showCreateProjectDropdown,
	userData,
	projects,
	toggleCollation,
	projectClick,
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
					<div className='sidebar-top__projects'>
						<span onClick={() => toggleCollation('show')} className='title'>
							projects-
							<span className='project-num'>{`(${!!projects && projects.data ? projects.data.length : 0})`}</span>
							<ToggleArrow click={projectClick} name='show' />
						</span>
						<div className='sidebar-top__projects-lists'>
							<ul className='normal-2'>
								{!!projects &&
									projects.data.map((project, i) =>
										projectClick === 'show' ? (
											<NavLink
												key={`${project._id}-${i}`}
												to={`${homeUrl}/${project._id}`}
												activeClassName='selected'
												className='project-list normal-2'
											>
												<span>{project.projectName}</span>
											</NavLink>
										) : null
									)}
							</ul>
						</div>
					</div>
				</div>
				<div className='sidebar-bottom'>
					<div onClick={(e) => showCreateProjectDropdown(e)} className='sidebar-bottom__newProject dropdown'>
						<button className='dropdown-button normal-2'>+ NEW</button>
						<NewProjectContainer />
					</div>
					<div onClick={(e) => showProfileSettingsDropdown(e)} className='sidebar-bottom__profile dropdown'>
						<div className='dropdown-button sidebar-bottom__profile-avatar'>
							{userData && userData?.avatar !== 'no-avatar' ? (
								<img src={userData?.avatar} alt='user data avatar' />
							) : (
								<span>{getStringInitials(userData?.name)}</span>
							)}
						</div>
						<UserSettingsContainer />
					</div>
				</div>
			</div>

			<i onClick={(e) => collapseClickHandler(e)} className='sidebar-collapsed fas fa-chevron-circle-left'></i>
		</aside>
	);
};

export default Sidebar;
