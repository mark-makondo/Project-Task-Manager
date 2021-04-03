import React from 'react';
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom';

const Sidebar = ({
	collapseClickHandler,
	profileModalClickHandler,
	createProjectModalClickHandler,
}) => {
	let temp = 2;
	let match = useRouteMatch();
	let tempProject = [
		{ projectName: 'Sample Project' },
		{ projectName: 'Test Project' },
	];

	let homeUrl = match.url;
	let currentUrl = useHistory().location.pathname;
	let isHome = homeUrl === currentUrl ? 'selected' : '';

	return (
		<aside className='sidebar normal-1'>
			<div className='sidebar-wrapper'>
				<div className='sidebar-top'>
					<div className='sidebar-top__home'>
						<NavLink
							to={homeUrl}
							activeClassName={isHome}
							className='title sidebar-hover'
						>
							home
						</NavLink>
					</div>
					<div className='sidebar-top__overview'>
						<NavLink
							to={`${homeUrl}/project-overview`}
							activeClassName='selected'
							className='title sidebar-hover'
						>
							overview
						</NavLink>
					</div>
					<div className='sidebar-top__projects'>
						<span className='title'>
							projects <span className='project-num'>{`(${temp})`}</span>
						</span>
						<ul className='normal-2'>
							{tempProject &&
								tempProject.map((data, i) => (
									<NavLink
										key={i}
										to={`${homeUrl}/${data.projectName.replace(/\s+/g, '')}`}
										activeClassName='selected'
										className='project-list normal-2 sidebar-hover'
									>
										<span>{data.projectName}</span>
									</NavLink>
								))}
						</ul>
					</div>
					<button onClick={createProjectModalClickHandler} className='normal-2'>
						+ NEW{' '}
					</button>
				</div>
				<div className='sidebar-bottom'>
					<div className='sidebar-bottom__profile'>
						<span onClick={profileModalClickHandler} className='sidebar-hover'>
							profile
						</span>
					</div>
				</div>
			</div>

			<i
				onClick={(e) => collapseClickHandler(e)}
				className='sidebar-collapsed fas fa-chevron-circle-left'
			></i>
		</aside>
	);
};

export default Sidebar;
