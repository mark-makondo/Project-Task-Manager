import React from 'react';

// components
import TableTemplateContainer from '../../components/tables/tableTemplate/TableTemplateContainer.js';

const Overview = ({ data }) => {
	let isDataExist = data && !!data.projects.length;

	return (
		<div className='overview'>
			<div style={isDataExist ? { height: 'unset' } : { height: '100%' }} className='overview-container'>
				{isDataExist ? (
					data.projects.map((project) => (
						<TableTemplateContainer key={`pro-${project._id}`} project={project} originalData={data} />
					))
				) : (
					<i className='overview-loading fas fa-spinner fa-spin'></i>
				)}
			</div>
		</div>
	);
};

export default Overview;
