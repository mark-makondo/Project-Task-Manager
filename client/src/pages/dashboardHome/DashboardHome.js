import React from 'react';

const DashboardHome = ({ user }) => {
	return (
		<div className='dashboard-home'>
			<div className='dashboard-home-wrapper'>
				<div className='dashboard-home-wrapper__header'>
					<h1 className='standout'>
						Welcome, <span>{user && user.name} </span>!
					</h1>
					<p className='normal-2'>
						Click the <strong>new button</strong> to create a new project and get started. Invite you're team in
						the project and be more productive. The app auto uploads the file that has been uploaded in the system
						to your own google drive. so don't forget to check your drive!
					</p>
				</div>
			</div>
		</div>
	);
};

export default DashboardHome;
