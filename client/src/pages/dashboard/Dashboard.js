import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

// components
import NavbarContainer from '../../components/navbar/NavbarContainer.js';
import SidebarContainer from '../../components/sidebar/SidebarContainer.js';

// pages
import OverviewContainer from '../../pages/overview/OverviewContainer.js';
import ProjectContainer from '../../pages/project/ProjectContainer.js';

const Dashboard = () => {
	let match = useRouteMatch();

	return (
		<div className='dashboard'>
			<NavbarContainer />
			<div className='dashboard-content'>
				<SidebarContainer />
				<Switch>
					<Route
						exact
						path={`${match.url}/project-overview`}
						component={(props) => <OverviewContainer {...props} key={match.path} />}
					/>
					<Route exact path={`${match.url}/:pid`} component={(props) => <ProjectContainer {...props} />} />
				</Switch>
			</div>
		</div>
	);
};

export default Dashboard;
