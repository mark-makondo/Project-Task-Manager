import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// pages
import HomeContainer from './pages/home/HomeContainer.js';
import DashboardContainer from './pages/dashboard/DashboardContainer.js';

// components
import ProceedFormContainer from './components/form/proceedForm/ProceedFormContainer.js';

// context
import AppState from './context/AppState.js';

const App = () => {
	return (
		<AppState>
			<Router>
				<div className='App'>
					<Route exact path='/' component={HomeContainer} />
					<Route exact path='/no-user-found/register' component={ProceedFormContainer} />
					<Route path='/:userid/dashboard' component={DashboardContainer} />
				</div>
			</Router>
		</AppState>
	);
};

export default App;
