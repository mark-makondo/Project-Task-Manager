import React from 'react';

//components
import LoginFormContainer from '../../components/form/loginForm/LoginFormContainer.js';

const Home = () => {
	return (
		<div className='home'>
			<div className='home-bg'></div>
			<LoginFormContainer />
		</div>
	);
};

export default Home;
