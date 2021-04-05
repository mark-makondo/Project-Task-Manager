import React from 'react';

import { useParams } from 'react-router-dom';

// ui
import TableProject from './TableProject';

// temp project data
import ProjectDataTemp from '../../../projectOverviewTemp.json';

const TableProjectContainer = () => {
	let params = useParams();

	return (
		<>
			<TableProject ProjectDataTemp={ProjectDataTemp[0]} urlParams={params} />
		</>
	);
};

export default TableProjectContainer;
