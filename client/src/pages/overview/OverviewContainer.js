import React, { useContext, useEffect } from 'react';
// ui
import Overview from './Overview.js';

// context actions
import Context from '../../context/Context.js';
import { GetAllProjectAction } from '../../context/actions/project/ProjectAction.js';

const OverviewContainer = () => {
	const {
		projectState: {
			project: { data, isLoading },
		},
		projectDispatch,
	} = useContext(Context);

	useEffect(() => {
		GetAllProjectAction()(projectDispatch);
	}, [projectDispatch]);

	return <Overview data={data} isLoading={isLoading} />;
};

export default OverviewContainer;
