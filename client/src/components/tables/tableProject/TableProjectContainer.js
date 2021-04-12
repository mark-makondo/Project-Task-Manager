import React, { useContext, useState } from 'react';
import Moment from 'moment';

// ui
import TableProject from './TableProject';

// helper
import Query from '../../../helper/query.js';

// context
import Context from '../../../context/Context.js';
import { TaskAction } from '../../../context/actions/project/TaskAction.js';

// sub components
import DialogueContainer from '../../modal/dialogue/DialogueContainer.js';
import ChatSidebarContainer from '../../chatSidebar/ChatSidebarContainer.js';

const TableProjectContainer = () => {
	const [confirmTaskDeleteDialogueOpen, setConfirmTaskDeleteDialogueOpen] = useState(false);
	const [confirmProjectDeleteDialogueOpen, setConfirmProjectDeleteDialogueOpen] = useState(false);
	const [currentTaskId, setCurrentTaskId] = useState();

	const [input, setInput] = useState({
		_pid: '',
		taskName: '',
		status: '',
		assigned: '',
		deadline: '',
	});

	const {
		getOneProjectState: {
			getOneProject: { isLoading, data },
		},
		getOneProjectDispatch,
	} = useContext(Context);

	//#region table title section
	const showEllipsisDropdown = (e) => {
		let current = e.currentTarget;

		let dropdownContentQuery = Query.dropdownContentSelect();

		dropdownContentQuery.classList.toggle('active');
		current.classList.toggle('active');
	};

	const ellipsisClickHandler = (e) => {
		let dropdownContentQuery = Query.dropdownContentSelect();

		let value = e.currentTarget.dataset.id;
		let isDelete = value === '1';

		if (isDelete) {
			setConfirmProjectDeleteDialogueOpen(!confirmProjectDeleteDialogueOpen);
			dropdownContentQuery.classList.remove('active');
		}
	};

	const confirmProjectDeleteHandler = () => {
		let type = 'removeProject';
		let formatedData = {
			_pid: data?.project._id,
			_id: data?.user._id,
		};

		TaskAction(formatedData, type)(getOneProjectDispatch);
		setConfirmProjectDeleteDialogueOpen(!confirmProjectDeleteDialogueOpen);
	};

	//#endregion

	//#region adding new row
	const submitHandler = (e) => {
		e.preventDefault();
		let type = 'create';

		TaskAction(input, type)(getOneProjectDispatch);
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
		let type = 'remove';
		let reqData = {
			_pid: data?.project._id,
			_tid: currentTaskId,
		};

		TaskAction(reqData, type)(getOneProjectDispatch);
		setConfirmTaskDeleteDialogueOpen(!confirmTaskDeleteDialogueOpen);
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
		let dropdownWrapperQuery = document.querySelector(
			`.table-project__content-tr__status--${tid} .status-wrapper`
		);

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
		// let tid = e.currentTarget.dataset.tid;
		// setCurrentTaskId(tid);
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
				ellipsisClickHandler={ellipsisClickHandler}
				showEllipsisDropdown={showEllipsisDropdown}
				showMessageSidebar={showMessageSidebar}
			/>
			<DialogueContainer
				isActive={confirmTaskDeleteDialogueOpen}
				setIsActive={setConfirmTaskDeleteDialogueOpen}
				confirmActionHandler={confirmTaskDeleteHandler}
			/>
			<DialogueContainer
				isActive={confirmProjectDeleteDialogueOpen}
				setIsActive={setConfirmProjectDeleteDialogueOpen}
				confirmActionHandler={confirmProjectDeleteHandler}
			/>
			{/* <ChatSidebarContainer /> */}
		</>
	);
};

export default TableProjectContainer;
