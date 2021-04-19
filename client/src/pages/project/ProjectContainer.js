import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// ui
import Project from './Project.js';

// context
import Context from '../../context/Context.js';
import { GetOneProjectAction } from '../../context/actions/project/GetOneProjectAction.js';
import { TaskActionGet } from '../../context/actions/project/ProjectTaskAction.js';

const ProjectContainer = () => {
	const { getOneProjectDispatch } = useContext(Context);
	const { projectTaskDispatch } = useContext(Context);

	const params = useParams();

	useEffect(() => {
		let pid = params.pid;
		GetOneProjectAction(pid)(getOneProjectDispatch);
	}, [params, getOneProjectDispatch]);

	useEffect(() => {
		let pid = params.pid;
		TaskActionGet(pid)(projectTaskDispatch);
	}, [params, projectTaskDispatch]);

	return <Project />;
};

export default ProjectContainer;
