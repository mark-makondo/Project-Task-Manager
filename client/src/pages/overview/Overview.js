import React from 'react';

// components
import TableTemplateContainer from '../../components/tables/tableTemplate/TableTemplateContainer.js';

// assets
import { ReactComponent as EmptySvg } from '../../assets/svg/empty-svg.svg';

const Overview = ({ isLoading, data }) => {
	let isDataExist = data && !!data.projects.length;

	return (
		<div className='overview'>
			<div style={isDataExist ? { height: 'unset' } : { height: '100%' }} className='overview-container'>
				{isDataExist ? (
					isLoading ? (
						<i className='overview-loading fas fa-spinner fa-spin'></i>
					) : (
						data.projects.map((project) => (
							<TableTemplateContainer key={`pro-${project._id}`} project={project} originalData={data} />
						))
					)
				) : (
					<div className='overview-bg'>
						<EmptySvg />
					</div>
				)}
			</div>
		</div>
	);
};

export default Overview;
