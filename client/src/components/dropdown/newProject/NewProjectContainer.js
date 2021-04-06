import React, { useState } from 'react';

// ui
import NewProject from './NewProject.js';

const NewProjectContainer = () => {
	const [input, setInput] = useState({
		projectName: '',
		companyEmail: '',
	});

	const formSubmitHandler = (e) => {
		e.preventDefault();

		console.log(input);
	};
	const inputOnChangeHandler = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<NewProject
			formSubmitHandler={formSubmitHandler}
			inputOnChangeHandler={inputOnChangeHandler}
		/>
	);
};

export default NewProjectContainer;
