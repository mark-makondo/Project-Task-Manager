import React, { useContext, useState, useEffect } from 'react';

// ui
import DashboardHome from './DashboardHome.js';

// context
import Context from '../../context/Context.js';

const DashboardHomeContainer = () => {
	const [user, setUser] = useState();

	const {
		userState: {
			user: { data },
		},
	} = useContext(Context);

	useEffect(() => {
		data && setUser(data);
	}, [data, user]);

	return <DashboardHome user={user} />;
};

export default DashboardHomeContainer;
