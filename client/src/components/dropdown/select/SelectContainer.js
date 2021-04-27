import React, { useEffect, useState } from 'react';

// ui
import Select from './Select.js';

const SelectContainer = ({ data, itemClickHandler, type, tid, projectMembers = null }) => {
	const [members, setMembers] = useState([]);

	useEffect(() => {
		if (type === '2') {
			projectMembers && setMembers(projectMembers?.data);
		}
	}, [members, projectMembers, type]);

	//#endregion

	return <Select data={data} members={members} itemClickHandler={itemClickHandler} type={type} tid={tid} />;
};

export default SelectContainer;
