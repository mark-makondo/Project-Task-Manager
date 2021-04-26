import React, { useContext, useState } from 'react';

// ui
import NewProject from './NewProject.js';

// context
import Context from '../../../context/Context.js';
import { CreateProjectAction } from '../../../context/actions/project/ProjectAction';

const NewProjectContainer = () => {
	const [input, setInput] = useState({
		projectName: '',
		companyEmail: '',
	});

	const {
		projectState: {
			project: { error, isLoading },
		},
		projectDispatch,
	} = useContext(Context);

	const formSubmitHandler = (e) => {
		e.preventDefault();

		CreateProjectAction(input)(projectDispatch);

		setInput({
			projectName: '',
			companyEmail: '',
		});
	};

	const inputOnChangeHandler = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<NewProject
			error={error}
			isLoading={isLoading}
			formSubmitHandler={formSubmitHandler}
			inputOnChangeHandler={inputOnChangeHandler}
			input={input}
		/>
	);
};

export default NewProjectContainer;
