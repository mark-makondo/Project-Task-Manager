import React, { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

// ui
import Project from './Project.js';

// context
import Context from '../../context/Context.js';
import { GetOneProjectAction } from '../../context/actions/project/GetOneProjectAction.js';

const ProjectContainer = () => {
	const {
		getOneProjectState: {
			getOneProject: { isLoading, data },
		},
		getOneProjectDispatch,
	} = useContext(Context);

	const trackChanges = useRef(false);

	const params = useParams();

	useEffect(() => {
		if (!trackChanges.current) {
			let pid = params.pid;
			GetOneProjectAction(pid)(getOneProjectDispatch);
			trackChanges.current = true;
		}
	}, [params, getOneProjectDispatch]);

	return (
		<>
			<Project isLoading={isLoading} data={data} />{' '}
		</>
	);
};

export default ProjectContainer;
