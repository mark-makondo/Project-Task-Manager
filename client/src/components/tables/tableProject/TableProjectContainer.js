import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Moment from 'moment';

// ui
import TableProject from './TableProject';

// helper
import axiosInstance from '../../../helper/axiosInstance.js';
import Query from '../../../helper/query.js';
import { dropdownHandler } from '../../../helper/helperFunctions.js';

// context
import Context from '../../../context/Context.js';
import { SocketContext } from '../../../context/SocketContext.js';
import { TaskMessageGetAction } from '../../../context/actions/project/TaskMessageAction.js';
import {
	TaskActionCreate,
	TaskActionRemove,
	TaskActionUpdate,
} from '../../../context/actions/project/ProjectTaskAction.js';

// sub components
import DialogueContainer from '../../modal/dialogue/DialogueContainer.js';
import ChatSidebarContainer from '../../chatSidebar/ChatSidebarContainer.js';

const TableProjectContainer = () => {
	const [projectTaskData, setProjectTaskData] = useState([]);
	const [confirmTaskDeleteDialogueOpen, setConfirmTaskDeleteDialogueOpen] = useState(false);
	const [projectMembers, setProjectMembers] = useState([]);
	const [taskID, setTaskID] = useState();
	const [input, setInput] = useState({
		_pid: '',
		taskName: '',
		status: '',
		assigned: '',
		deadline: '',
	});

	const socket = useContext(SocketContext);

	const {
		getOneProjectState: {
			getOneProject: { data, isLoading },
		},
		taskMessageDispatch,
		projectTaskState: { projectTasks },
		projectTaskDispatch,
	} = useContext(Context);

	const params = useParams();

	//#region globally used functions in this js file.
	const returnIsAcceptedMemberEmail = () => {
		return data?.project.members
			.filter((member) => {
				return member.isAccepted === true;
			})
			.map((member) => {
				return member._id.email;
			});
	};

	const updaterFunction = async (updateData) => {
		try {
			let pid = data?.project._id;
			let emails = returnIsAcceptedMemberEmail();

			let result = await axiosInstance().put('/project/task/update', updateData);

			let resData = result.data;

			await TaskActionUpdate(resData)(projectTaskDispatch);

			let formatToSend = {
				type: 'taskUpdate',
				emails,
				pid,
				data: resData,
			};

			socket.emit('row_send_update', formatToSend);
		} catch (error) {
			console.error(error);
		}
	};

	//#endregion

	//#region responsible for table realtime updates.
	useEffect(() => {
		projectTasks && setProjectTaskData(projectTasks);
	}, [projectTasks, projectTaskData]);

	useEffect(() => {
		let currentUserEmail = data?.user.email;
		let paramsPid = params.pid;

		socket.on('row_receive_update', (content) => {
			let { type, data, emails, pid } = content;

			emails &&
				emails.forEach((email) => {
					if (email === currentUserEmail && paramsPid === pid) {
						if (type === 'create') TaskActionCreate(data)(projectTaskDispatch);
						if (type === 'remove') TaskActionRemove(data)(projectTaskDispatch);
						if (type === 'taskUpdate') TaskActionUpdate(data)(projectTaskDispatch);
					}
					return;
				});
		});

		return () => {
			socket.off('row_receive_update');
		};
	}, [socket, projectTaskDispatch, data?.user.email, params.pid]);

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
	const submitHandler = async (e) => {
		e.preventDefault();

		let pid = data?.project._id;
		let emails = returnIsAcceptedMemberEmail();

		let result = await axiosInstance().post('/project/task/add', input);
		let resData = result?.data.result2;

		await TaskActionCreate(resData)(projectTaskDispatch);

		let formatToSend = {
			type: 'create',
			data: resData,
			emails,
			pid,
		};

		socket.emit('row_send_update', formatToSend);
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
		let tid = e.currentTarget.dataset.tid;
		localStorage.setItem('local-tid', tid);

		setConfirmTaskDeleteDialogueOpen(!confirmTaskDeleteDialogueOpen);
	};

	const confirmTaskDeleteHandler = async () => {
		let tid = localStorage.getItem('local-tid');
		let pid = data?.project._id;
		let emails = returnIsAcceptedMemberEmail();

		await axiosInstance().delete(`/project/task/remove/${pid}/${tid}`);
		await TaskActionRemove(tid)(projectTaskDispatch);

		let formatToSend = {
			type: 'remove',
			data: tid,
			emails,
			pid,
		};

		socket.emit('row_send_update', formatToSend);

		localStorage.removeItem('local-tid');
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

	const taskSaveClickHandler = async (e) => {
		let tid = e.currentTarget.dataset.tid;
		let editWrapperQuery = document.querySelector(`.table-project__content-tr .edit-wrapper--${tid}`);
		let contentWrapperQuery = document.querySelector(`.table-project__content-tr .content-wrapper--${tid}`);

		editWrapperQuery.classList.remove('editing');
		contentWrapperQuery.classList.remove('enable-edit');

		let pid = data?.project._id;

		let updateData = {
			_pid: pid,
			_tid: tid,
			update: {
				taskName: input.taskName,
			},
		};

		await updaterFunction(updateData);
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

		dropdownWrapperQuery.addEventListener('blur', () => {
			dropdownContentQuery.classList.remove('active');
			dropdownWrapperQuery.classList.remove('active');
		});
	};

	const selectedStatusClickHandler = async (e) => {
		e.preventDefault();

		let tid = e.currentTarget.dataset.id;
		let listValue = e.currentTarget.innerHTML;

		let dropdownContentQuery = document.querySelector(
			`.table-project__content-tr__status--${tid} .dropdown-content-select`
		);

		dropdownContentQuery.classList.remove('active');

		let updateData = {
			_pid: data?.project._id,
			_tid: tid,
			update: {
				status: listValue,
			},
		};

		await updaterFunction(updateData);
	};

	//#endregion

	//#region task deadline selection
	const dateSelectHandler = async (date, tid) => {
		let formattedDate = Moment(date, 'MM/DD/YYYY').format('MM/DD/YYYY');

		let updateData = {
			_pid: data?.project._id,
			_tid: tid,
			update: {
				deadline: formattedDate,
			},
		};

		await updaterFunction(updateData);
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
			TaskMessageGetAction(tid)(taskMessageDispatch);
			queryChatSidebar.classList.add('active');
		}
		socket.emit('join', tid);
	};

	//#endregion

	//#region task person
	const showPersonsDropdown = (e) => {
		let tid = e.currentTarget.dataset.tid;

		let dropdownContentQuery = document.querySelector(
			`.table-project__content-tr__avatar--${tid} .dropdown-content-select`
		);
		let dropdownWrapperQuery = document.querySelector(
			`.table-project__content-tr__avatar--${tid} .dropdown-button`
		);

		dropdownContentQuery.classList.add('active');
		dropdownWrapperQuery.classList.add('active');

		dropdownWrapperQuery.addEventListener('blur', () => {
			dropdownContentQuery.classList.remove('active');
			dropdownWrapperQuery.classList.remove('active');
		});
	};

	const selectedPersonClickHandler = async (e) => {
		e.preventDefault();

		let tid = e.currentTarget.dataset.tid;
		let personId = e.currentTarget.dataset.id;
		let personName = e.currentTarget.dataset.name;
		let personEmail = e.currentTarget.dataset.email;
		let personAvatar = e.currentTarget.dataset.avatar;

		let dropdownContentQuery = document.querySelector(
			`.table-project__content-tr__avatar--${tid} .dropdown-content-select`
		);

		dropdownContentQuery.classList.remove('active');

		let updateData = {
			_pid: data?.project._id,
			_tid: tid,
			update: {
				assigned: {
					_id: personId,
					name: personName,
					email: personEmail,
					avatar: personAvatar,
				},
			},
		};
		await updaterFunction(updateData);
	};

	useEffect(() => {
		let projectOwner = data?.project.owner;
		let projectOwnerCreatedAt = data?.project.owner.createdAt;
		let projectOriginalMembers = data?.project.members;

		let memberFormat = {
			_id: projectOwner,
			isAccepted: true,
			joinedDate: Moment(projectOwnerCreatedAt).format('ddd MMM D yy'),
		};
		projectOwner && setProjectMembers(projectOriginalMembers.concat(memberFormat));
	}, [data?.project.owner, data?.project.members]);

	//#endregion

	return (
		<>
			{!isLoading ? (
				<TableProject
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
					projectTaskData={projectTaskData}
					projectMembers={projectMembers}
				/>
			) : (
				<i className='project-loading fas fa-spinner fa-spin'></i>
			)}
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
