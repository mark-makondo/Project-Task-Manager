import React from 'react';

//pages
import HomeContainer from './pages/home/HomeContainer.js';
import DashboardContainer from './pages/dashboard/DashboardContainer.js';

const App = () => {
	return (
		<div className='App'>
			<HomeContainer />
			<DashboardContainer />
		</div>
	);
};

export default App;
