import React from 'react';

// components
import TableTemplateContainer from '../../components/tables/tableTemplate/TableTemplateContainer.js';

// empty svg
import { ReactComponent as EmptySvg } from '../../assets/svg/empty-svg.svg';

const Overview = ({ data, isLoading }) => {
	let isDataExist = data && !!data.projects.length;

	return (
		<div className='overview'>
			<div style={isDataExist ? { height: 'unset' } : { height: '100%' }} className='overview-container'>
				{isLoading ? (
					<i className='overview-loading fas fa-spinner fa-spin'></i>
				) : isDataExist ? (
					data.projects.map((project) => (
						<TableTemplateContainer key={`pro-${project._id}`} project={project} originalData={data} />
					))
				) : (
					<EmptySvg />
				)}
			</div>
		</div>
	);
};

export default Overview;
