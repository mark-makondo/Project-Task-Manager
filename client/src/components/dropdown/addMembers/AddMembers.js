import React from 'react';

const AddMembers = ({ inputOnChange, input, formSubmitHandler, status, isLoading }) => {
	return (
		<div className='dropdown-content-add-members'>
			<form onSubmit={(e) => formSubmitHandler(e)}>
				<div className='input-group'>
					<div className='input-group__label normal-2'>
						<label htmlFor='memberEmail'>Email:</label>

						<span title='The email must be a valid user.'>
							<i className='fas fa-info-circle'></i>
						</span>
					</div>

					<input
						autoComplete='off'
						className='normal-2 focus-dropdown'
						type='email'
						name='membersEmail'
						onChange={(e) => inputOnChange(e)}
						value={input.membersEmail}
					/>
				</div>

				{isLoading ? (
					<span className='normal-2 add-members-loading '>
						<i className='fas fa-spinner fa-spin'></i>
						<span className='normal-3'>Please Wait...</span>
					</span>
				) : (
					<button className='focus-dropdown' type='submit'>
						Invite
					</button>
				)}
			</form>

			{status ? (
				<div className='error normal-3'>
					<span>{status}</span>
				</div>
			) : (
				<span></span>
			)}
		</div>
	);
};

export default AddMembers;
