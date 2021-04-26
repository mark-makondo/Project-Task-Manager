import React, { useContext, useEffect, useState } from 'react';

// ui
import Overview from './Overview.js';

// context actions
import Context from '../../context/Context.js';
import { GetAllProjectAction } from '../../context/actions/project/ProjectAction.js';
import { GetOneProjectAction } from '../../context/actions/project/GetOneProjectAction';

// modal
import MembersModalContainer from '../../components/modal/overviewMembers/OverviewMembersContainer.js';
import TasksModalContainer from '../../components/modal/overviewTasks/OverviewTasksContainer.js';
import UploadedFilesModalContainer from '../../components/modal/uploadedFiles/UploadedFilesContainer';

// helper
import { dropdownHandler } from '../../helper/helperFunctions.js';
import Query from '../../helper/query';

const OverviewContainer = () => {
	const [isOverviewMemberModalActive, setIsOverviewMemberModalActive] = useState(false);
	const [isOverviewTasksModalActive, setIsOverviewTasksModalActive] = useState(false);
	const [isOverviewUploadedFilesModalActive, setIsOverviewUploadedFilesModalActive] = useState(false);
	const [projectCount, setProjectCount] = useState(0);
	const [ownedProjects, setOwnedProjects] = useState([]);

	const {
		userState: { user },

		projectState: {
			project: { data },
		},
		projectDispatch,

		getOneProjectState: { getOneProject },
		getOneProjectDispatch,
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

	//#endregion

	//#region project holder click handler for modals
	const actionWhenModalIsOpen = (pid, type) => {
		GetOneProjectAction(pid)(getOneProjectDispatch);

		switch (type) {
			case 'OPEN_MEMBERS_MODAL':
				return setIsOverviewMemberModalActive(!isOverviewMemberModalActive);
			case 'OPEN_TASKS_MODAL':
				return setIsOverviewTasksModalActive(!isOverviewTasksModalActive);
			case 'OPEN_UPLOADED_FILES__MODAL':
				return setIsOverviewUploadedFilesModalActive(!isOverviewUploadedFilesModalActive);
			default:
				return;
		}
	};

	const showMembersOnClickHandler = (e) => {
		let pid = e.target.dataset.pid;
		let type = 'OPEN_MEMBERS_MODAL';

		actionWhenModalIsOpen(pid, type);
	};

	const showTasksOnClickHandler = (e) => {
		let pid = e.target.dataset.pid;
		let type = 'OPEN_TASKS_MODAL';

		actionWhenModalIsOpen(pid, type);
	};

	const showUploadedFilesOnClickHandler = (e) => {
		let pid = e.target.dataset.pid;
		let type = 'OPEN_UPLOADED_FILES__MODAL';

		actionWhenModalIsOpen(pid, type);
	};
	//#endregion

	//#region dropdown
	const showOwnedProjectsDropdown = (e) => {
		const dropdownContentQuery = Query.dropdownOwnedProjectsContent();
		const dropdownButtonQuery = Query.dropdownOwnedProjectsButton();

		dropdownHandler(e, dropdownContentQuery, dropdownButtonQuery);
	};

	//#endregion
	return (
		<>
			<Overview
				data={data}
				projectCount={projectCount}
				ownedProjects={ownedProjects}
				showMembersOnClickHandler={showMembersOnClickHandler}
				showTasksOnClickHandler={showTasksOnClickHandler}
				showUploadedFilesOnClickHandler={showUploadedFilesOnClickHandler}
				showOwnedProjectsDropdown={showOwnedProjectsDropdown}
			/>

			<MembersModalContainer
				data={getOneProject.data}
				isLoading={getOneProject.isLoading}
				isActive={isOverviewMemberModalActive}
				setIsActive={setIsOverviewMemberModalActive}
			/>

			<TasksModalContainer
				data={getOneProject.data}
				isLoading={getOneProject.isLoading}
				isActive={isOverviewTasksModalActive}
				setIsActive={setIsOverviewTasksModalActive}
			/>

			<UploadedFilesModalContainer
				data={getOneProject.data}
				isLoading={getOneProject.isLoading}
				isActive={isOverviewUploadedFilesModalActive}
				setIsActive={setIsOverviewUploadedFilesModalActive}
			/>
		</>
	);
};

export default OverviewContainer;
