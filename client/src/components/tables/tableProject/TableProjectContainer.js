import React, { useContext, useEffect, useState } from 'react';
import Moment from 'moment';

// ui
import TableProject from './TableProject';

// helper
import Query from '../../../helper/query.js';
import { dropdownHandler } from '../../../helper/helperFunctions.js';

// context
import Context from '../../../context/Context.js';
import { TaskAction } from '../../../context/actions/project/TaskAction.js';
import { TaskMessageAction } from '../../../context/actions/project/TaskMessageAction.js';

// testing context
import { TaskActionCreate, TaskActionRemove } from '../../../context/actions/project/ProjectTaskAction.js';

// sub components
import DialogueContainer from '../../modal/dialogue/DialogueContainer.js';
import ChatSidebarContainer from '../../chatSidebar/ChatSidebarContainer.js';

const TableProjectContainer = () => {
	const [confirmTaskDeleteDialogueOpen, setConfirmTaskDeleteDialogueOpen] = useState(false);
	const [currentTaskId, setCurrentTaskId] = useState();
	const [taskID, setTaskID] = useState();
	const [input, setInput] = useState({
		_pid: '',
		taskName: '',
		status: '',
		assigned: '',
		deadline: '',
	});
	const [projectTaskData, setProjectTaskData] = useState([]);

	const {
		getOneProjectState: {
			getOneProject: { isLoading, data },
		},
		getOneProjectDispatch,
	} = useContext(Context);

	const { taskMessageDispatch } = useContext(Context);

	// testing state
	const {
		projectTaskState: { projectTasks },
		projectTaskDispatch,
	} = useContext(Context);

	//#region TESTING ADDING OF CONTEXT ON THE TABLE
	useEffect(() => {
		projectTasks && console.log('PROJECT TASK TESTING', projectTasks);
		projectTasks && console.log('PROJECT STATE TESTING', projectTaskData);
		projectTasks && setProjectTaskData(projectTasks);
	}, [projectTasks, projectTaskData]);

	//#endregion

	//#region table title section
	const showEllipsisDropdown = (e) => {
		const dropdownContentQuery = Query.dropdownTableSettingsContent();
		const dropdownButtonQuery = Query.dropdownTableSettingsButton();

		dropdownHandler(e, dropdownContentQuery, dropdownButtonQuery);
	};

	const showAddMembersDropdown = (e) => {
		const dropdownContentQuery = Query.dropdownAddMembersContent();
		const dropdownButtonQuery = Query.dropdownAddMembersButton();

		dropdownHandler(e, dropdownContentQuery, dropdownButtonQuery);
	};
	//#endregion

	//#region adding new row
	const submitHandler = (e) => {
		e.preventDefault();

		TaskActionCreate(input)(projectTaskDispatch);
	};

	const inputOnChangeHandler = (e) => {
		setInput({
			...input,
			_pid: data?.project._id,
			assigned: data?.project.owner._id,
			[e.currentTarget.name]: e.currentTarget.value,
		});
	};
	//#endregion

	//#region deleting a row
	const taskDeleteClickHandler = (e) => {
		let datatid = e.currentTarget.dataset.tid;

		setCurrentTaskId(datatid);
		setConfirmTaskDeleteDialogueOpen(!confirmTaskDeleteDialogueOpen);
	};

	const confirmTaskDeleteHandler = () => {
		let reqData = {
			_pid: data?.project._id,
			_tid: currentTaskId,
		};

		localStorage.removeItem('local-tid');
		setConfirmTaskDeleteDialogueOpen(!confirmTaskDeleteDialogueOpen);

		TaskActionRemove(reqData)(projectTaskDispatch);
	};
	//#endregion

	//#region updating a taskname
	const taskEditClickHandler = (e) => {
		let tid = e.currentTarget.dataset.tid;

		let editWrapperQuery = document.querySelector(`.table-project__content-tr .edit-wrapper--${tid}`);
		let contentWrapperQuery = document.querySelector(`.table-project__content-tr .content-wrapper--${tid}`);

		editWrapperQuery.classList.add('editing');
		contentWrapperQuery.classList.add('enable-edit');
	};

	const taskNameEditOnChange = (e) => {
		setInput({
			...input,
			_pid: data?.project._id,
			[e.currentTarget.name]: e.currentTarget.value,
		});
	};

	const taskSaveClickHandler = (e) => {
		let tid = e.currentTarget.dataset.tid;
		let editWrapperQuery = document.querySelector(`.table-project__content-tr .edit-wrapper--${tid}`);
		let contentWrapperQuery = document.querySelector(`.table-project__content-tr .content-wrapper--${tid}`);

		editWrapperQuery.classList.remove('editing');
		contentWrapperQuery.classList.remove('enable-edit');

		let type = 'update';
		let reqData = {
			_pid: input._pid,
			_tid: tid,
			update: {
				taskName: input.taskName,
			},
		};

		TaskAction(reqData, type)(getOneProjectDispatch);
	};
	//#endregion

	//#region task status
	const showStatusDropdown = (e) => {
		let tid = e.currentTarget.dataset.tid;

		let dropdownContentQuery = document.querySelector(
			`.table-project__content-tr__status--${tid} .dropdown-content-select`
		);
		let dropdownWrapperQuery = document.querySelector(`.table-project__content-tr__status--${tid} .status-wrapper`);

		dropdownContentQuery.classList.toggle('active');
		dropdownWrapperQuery.classList.toggle('active');
	};

	const selectedStatusClickHandler = (e) => {
		let tid = e.currentTarget.dataset.id;
		let listValue = e.currentTarget.innerHTML;

		let dropdownContentQuery = document.querySelector(
			`.table-project__content-tr__status--${tid} .dropdown-content-select`
		);

		dropdownContentQuery.classList.remove('active');

		let type = 'update';
		let reqData = {
			_pid: data?.project._id,
			_tid: tid,
			update: {
				status: listValue,
			},
		};

		TaskAction(reqData, type)(getOneProjectDispatch);
	};

	//#endregion

	//#region task deadline selection
	const dateSelectHandler = (date, tid) => {
		let formattedDate = Moment.utc(date, 'MM/DD/YYYY').format('MM/DD/YYYY');

		let type = 'update';
		let reqData = {
			_pid: data?.project._id,
			_tid: tid,
			update: {
				deadline: formattedDate,
			},
		};

		TaskAction(reqData, type)(getOneProjectDispatch);
	};
	//#endregion

	//#region task messages and file upload
	const showMessageSidebar = (e) => {
		let queryChatSidebar = Query.chatSideBarContainer();
		let tid = e.currentTarget.dataset.tid;
		localStorage.setItem('local-tid', tid);

		if (localStorage.getItem('local-tid') !== taskID) {
			setTaskID(tid);
		}
		if (e.target === e.currentTarget) {
			TaskMessageAction(tid, 'get')(taskMessageDispatch);
			queryChatSidebar.classList.add('active');
		}
	};

	//#endregion

	//#region task person
	const showPersonsDropdown = (e) => {
		let tid = e.currentTarget.dataset.tid;

		let dropdownContentQuery = document.querySelector(
			`.table-project__content-tr__avatar--${tid} .dropdown-content-select`
		);
		let dropdownWrapperQuery = document.querySelector(`.table-project__content-tr__avatar--${tid} .dropdown-button`);

		dropdownContentQuery.classList.toggle('active');
		dropdownWrapperQuery.classList.toggle('active');
	};

	const selectedPersonClickHandler = (e) => {
		let tid = e.currentTarget.dataset.tid;
		let personId = e.currentTarget.dataset.id;

		let dropdownContentQuery = document.querySelector(
			`.table-project__content-tr__avatar--${tid} .dropdown-content-select`
		);

		dropdownContentQuery.classList.remove('active');

		let type = 'assignPerson';
		let reqData = {
			_pid: data?.project._id,
			_tid: tid,
			update: {
				assigned: personId,
			},
		};

		TaskAction(reqData, type)(getOneProjectDispatch);
	};
	//#endregion

	return (
		<>
			<TableProject
				isLoading={isLoading}
				data={data}
				submitHandler={submitHandler}
				inputOnChangeHandler={inputOnChangeHandler}
				input={input}
				taskDeleteClickHandler={taskDeleteClickHandler}
				taskEditClickHandler={taskEditClickHandler}
				taskSaveClickHandler={taskSaveClickHandler}
				taskNameEditOnChange={taskNameEditOnChange}
				showStatusDropdown={showStatusDropdown}
				selectedStatusClickHandler={selectedStatusClickHandler}
				dateSelectHandler={dateSelectHandler}
				showEllipsisDropdown={showEllipsisDropdown}
				showMessageSidebar={showMessageSidebar}
				showAddMembersDropdown={showAddMembersDropdown}
				showPersonsDropdown={showPersonsDropdown}
				selectedPersonClickHandler={selectedPersonClickHandler}
				// testing
				projectTaskData={projectTaskData}
			/>
			<DialogueContainer
				isActive={confirmTaskDeleteDialogueOpen}
				setIsActive={setConfirmTaskDeleteDialogueOpen}
				confirmActionHandler={confirmTaskDeleteHandler}
			/>

			<ChatSidebarContainer taskID={taskID} />
		</>
	);
};

export default TableProjectContainer;
