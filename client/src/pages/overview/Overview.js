import React from 'react';

// components
import TableTemplateContainer from '../../components/tables/tableTemplate/TableTemplateContainer.js';

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
						<TableTemplateContainer
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
