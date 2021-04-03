import React from 'react';

// ui
import Overview from './Overview.js';

// tempdata
import projectTemplate from '../../projectOverviewTemp.json';

const OverviewContainer = () => {
	let img = false;
	let text = `Lorem ipsum, dolor sit amet consectetur adipisicing elit.
	Quibusdam doloribus, facere ad vero ea in dignissimos
	excepturi repudiandae temporibus nisi magnam officia
	assumenda, consectetur quod sint nemo ex magni aperiam.`;

	return (
		<>
			<Overview projectTemplate={projectTemplate} img={img} text={text} />
		</>
	);
};

export default OverviewContainer;
