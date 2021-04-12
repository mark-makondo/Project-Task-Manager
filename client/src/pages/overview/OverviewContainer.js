import React, { useContext, useEffect, useRef } from 'react';
// ui
import Overview from './Overview.js';

// context actions
import Context from '../../context/Context.js';
import { GetAllProjectAction } from '../../context/actions/project/GetAllProjectAction.js';

const OverviewContainer = () => {
	const {
		projectState: {
			project: { data },
		},
		projectDispatch,
	} = useContext(Context);

	const trackChanges = useRef(false);

	useEffect(() => {
		if (!trackChanges.current) {
			GetAllProjectAction()(projectDispatch);

			trackChanges.current = true;
		}
	}, [projectDispatch]);
	return <Overview data={data} />;
};

export default OverviewContainer;
