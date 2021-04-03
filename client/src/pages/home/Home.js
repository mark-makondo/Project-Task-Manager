import React from 'react';

//components
import HomeBackground from '../../components/homeBackground/HomeBackground.js';
import LoginFormContainer from '../../components/form/loginForm/LoginFormContainer.js';

const Home = () => {
	return (
		<div className='home'>
			<HomeBackground />
			<LoginFormContainer />
		</div>
	);
};

export default Home;
