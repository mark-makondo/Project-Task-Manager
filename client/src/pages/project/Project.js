import React from 'react';

// components
import TableTemplateContainer from '../../components/tables/tableTemplate/TableTemplateContainer.js';

const Project = ({ projectTemplate, img, text }) => {
	return (
		<div className='project'>
			<div className='project-container'>
				<TableTemplateContainer
					project={projectTemplate[0]}
					img={img}
					text={text}
				/>
			</div>
		</div>
	);
};

export default Project;
