import React, { useContext } from 'react';

// ui
import Overview from './Overview.js';

// context actions
import Context from '../../context/Context.js';

const OverviewContainer = () => {
	const {
		projectState: {
			project: { isLoading, data },
		},
	} = useContext(Context);

	return <Overview isLoading={isLoading} data={data} />;
};

export default OverviewContainer;
