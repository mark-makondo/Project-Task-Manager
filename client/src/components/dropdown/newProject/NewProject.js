import React from 'react';

const NewProject = ({ formSubmitHandler, inputOnChangeHandler }) => {
	return (
		<div className='dropdown-content-new-project'>
			<form onSubmit={(e) => formSubmitHandler(e)}>
				<div className='input-group'>
					<div className='input-group__label normal-2'>
						<label htmlFor='projectName'>What is your project name?</label>

						<span title='Name for your project.'>
							<i className='fas fa-info-circle'></i>
						</span>
					</div>

					<input
						autoComplete='off'
						className='normal-2 focus-dropdown'
						onChange={(e) => inputOnChangeHandler(e)}
						type='text'
						name='projectName'
					/>
				</div>
				<div className='input-group'>
					<div className='input-group__label normal-2'>
						<label htmlFor='companyName'>Company Email:</label>

						<span title='This will be used for auto transfer of ownership of files in google drive.'>
							<i className='fas fa-info-circle'></i>
						</span>
					</div>

					<input
						autoComplete='off'
						className='normal-2 focus-dropdown'
						onChange={(e) => inputOnChangeHandler(e)}
						type='email'
						name='companyEmail'
					/>
				</div>
				<button type='submit'>Create Project</button>
			</form>
		</div>
	);
};

export default NewProject;
