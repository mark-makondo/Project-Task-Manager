import React from 'react';

// components
import TableOverviewContainer from '../../components/tables/tableOverview/TableOverviewContainer.js';
// projectTemplate,

// assets
import { ReactComponent as EmptySvg } from '../../assets/svg/empty-svg.svg';

const Overview = ({ projectTemplate, img, text }) => {
	return (
		<div className='overview'>
			<div
				style={
					!!projectTemplate.length ? { height: 'unset' } : { height: '100%' }
				}
				className='overview-container'
			>
				{!!projectTemplate.length ? (
					projectTemplate.map((project) => (
						<TableOverviewContainer
							key={`pro-${project.id}`}
							project={project}
							img={img}
							text={text}
						/>
					))
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
