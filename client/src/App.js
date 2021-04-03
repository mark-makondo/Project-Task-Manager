import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//pages
import HomeContainer from './pages/home/HomeContainer.js';
import DashboardContainer from './pages/dashboard/DashboardContainer.js';

//components
import ProceedFormContainer from './components/form/proceedForm/ProceedFormContainer.js';
import RegisterFormContainer from './components/form/registerForm/RegisterFormContainer.js';

const App = () => {
	return (
		<>
			<Router>
				<div className='App'>
					<Route exact path='/' component={HomeContainer} />
					<Route exact path='/register' component={RegisterFormContainer} />
					<Route
						exact
						path='/no-user-found/register'
						component={ProceedFormContainer}
					/>
					<Route path='/:userid/dashboard' component={DashboardContainer} />
				</div>
			</Router>
		</>
	);
};

export default App;
