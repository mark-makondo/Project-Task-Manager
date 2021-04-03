import React from 'react';
import { useParams } from 'react-router-dom';

const Project = () => {
	let params = useParams();

	return (
		<div className='project'>
			<h1>{params.name}</h1>
		</div>
	);
};

export default Project;
