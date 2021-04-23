import React, { useContext, useEffect, useState } from 'react';

// ui
import Overview from './Overview.js';

// context actions
import Context from '../../context/Context.js';
import { GetAllProjectAction } from '../../context/actions/project/ProjectAction.js';
import { GetOneProjectAction } from '../../context/actions/project/GetOneProjectAction';

// modal
import OverviewModalMembersContainer from '../../components/modal/overviewMembers/OverviewMembersContainer.js';
import OverviewModalTasksContainer from '../../components/modal/overviewTasks/OverviewTasksContainer.js';

const OverviewContainer = () => {
	const [isOverviewMemberModalActive, setIsOverviewMemberModalActive] = useState(false);
	const [isOverviewTasksModalActive, setIsOverviewTasksModalActive] = useState(false);
	const [projectCount, setProjectCount] = useState(0);
	const [ownedProjects, setOwnedProjects] = useState([]);
	const [clicked, setClicked] = useState(false);

	const {
		projectState: {
			project: { data, isLoading },
		},
		projectDispatch,
	} = useContext(Context);

	const {
		getOneProjectState: { getOneProject },
		getOneProjectDispatch,
	} = useContext(Context);

	const {
		userState: { user },
	} = useContext(Context);

	useEffect(() => {
		GetAllProjectAction()(projectDispatch);
	}, [projectDispatch]);

	//#region logic for getting calculated data
	useEffect(() => {
		let isUser = user && user;
		let projects = data && data;

		let currentUser = isUser.data?._id;

		let projectLength = projects.length;

		let ownedProjects = projects.filter((project) => {
			return project.owner._id === currentUser;
		});

		setProjectCount(projectLength);
		setOwnedProjects(ownedProjects);
	}, [data, user]);

	const toggleCollation = (index) => {
		if (clicked === index) return setClicked(null);
		return setClicked(index);
	};

	//#endregion

	//#region project holder click handler for modals
	const showMembersOnClickHandler = (e) => {
		let pid = e.target.dataset.pid;

		GetOneProjectAction(pid)(getOneProjectDispatch);

		setIsOverviewMemberModalActive(!isOverviewMemberModalActive);
	};

	const showTasksOnClickHandler = (e) => {
		let pid = e.target.dataset.pid;

		console.log(pid);
		GetOneProjectAction(pid)(getOneProjectDispatch);

		setIsOverviewTasksModalActive(!isOverviewTasksModalActive);
	};

	//#endregion

	return (
		<>
			<Overview
				data={data}
				isLoading={isLoading}
				projectCount={projectCount}
				ownedProjects={ownedProjects}
				clicked={clicked}
				toggleCollation={toggleCollation}
				showMembersOnClickHandler={showMembersOnClickHandler}
				showTasksOnClickHandler={showTasksOnClickHandler}
			/>

			<OverviewModalMembersContainer
				data={getOneProject.data}
				isLoading={getOneProject.isLoading}
				isActive={isOverviewMemberModalActive}
				setIsActive={setIsOverviewMemberModalActive}
			/>
			<OverviewModalTasksContainer
				data={getOneProject.data}
				isLoading={getOneProject.isLoading}
				isActive={isOverviewTasksModalActive}
				setIsActive={setIsOverviewTasksModalActive}
			/>
		</>
	);
};

export default OverviewContainer;
