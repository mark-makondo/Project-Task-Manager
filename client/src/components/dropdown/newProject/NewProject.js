import React from 'react';

const NewProject = ({ formSubmitHandler, inputOnChangeHandler, error, isLoading, input }) => {
	return (
		<div className='dropdown-content-new-project'>
			<form onSubmit={(e) => formSubmitHandler(e)}>
				<div className='input-group'>
					<div className='input-group__label normal-3'>
						<label htmlFor='projectName'>What is your project name?</label>

						<span title='Name for your project.'>
							<i className='fas fa-info-circle'></i>
						</span>
					</div>

					<input
						autoComplete='off'
						className='normal-3 focus-dropdown'
						onChange={(e) => inputOnChangeHandler(e)}
						type='text'
						name='projectName'
						value={input.projectName}
					/>
				</div>
				<div className='input-group'>
					<div className='input-group__label normal-3'>
						<label htmlFor='companyName'>Company Email:</label>

						<span title='This will be used for auto transfer of ownership of files in google drive.'>
							<i className='fas fa-info-circle'></i>
						</span>
					</div>

					<input
						autoComplete='off'
						className='normal-3 focus-dropdown'
						onChange={(e) => inputOnChangeHandler(e)}
						type='email'
						name='companyEmail'
						value={input.companyEmail}
					/>
				</div>

				{isLoading ? (
					<span className='normal-2 project-create-loading '>
						<i className='fas fa-spinner fa-spin'></i>
						<span className='normal-3'>Please Wait...</span>
					</span>
				) : (
					<button className='focus-dropdown' type='submit'>
						Create Project
					</button>
				)}
			</form>

			{error && (
				<div className='error normal-3'>
					<span>{error}</span>
				</div>
			)}
		</div>
	);
};

export default NewProject;
