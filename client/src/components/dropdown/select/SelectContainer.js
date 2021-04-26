import React, { useEffect, useState, useContext } from 'react';

// ui
import Select from './Select.js';

// context
import Context from '../../../context/Context.js';
import { ProjectMembersGetAction } from '../../../context/actions/project/ProjectMembersAction.js';

const SelectContainer = ({ data, itemClickHandler, type, tid }) => {
	const [members, setMembers] = useState([]);

	const {
		projectMembersState: { projectMembers },
		projectMembersDispatch,
	} = useContext(Context);

	//#region members logic
	useEffect(() => {
		if (type === '2') {
			let projectId = data?.project?._id;

			data.project && ProjectMembersGetAction(projectId)(projectMembersDispatch);
		}
	}, [projectMembersDispatch, data?.project?._id, data, type]);

	useEffect(() => {
		if (type === '2') {
			projectMembers && setMembers(projectMembers?.data);
		}
	}, [members, projectMembers, type]);

	//#endregion

	return <Select data={data} members={members} itemClickHandler={itemClickHandler} type={type} tid={tid} />;
};

export default SelectContainer;
