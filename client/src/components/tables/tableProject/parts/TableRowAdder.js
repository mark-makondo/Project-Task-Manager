import React from 'react';

const TableRowAdder = ({ inputOnChangeHandler, submitHandler }) => {
	return (
		<div className='table-project__content-tr-adder'>
			<div className='indicator'></div>
			<form className='content-wrapper' onSubmit={(e) => submitHandler(e)}>
				<input
					autoComplete='off'
					onChange={(e) => inputOnChangeHandler(e)}
					className='normal-2'
					placeholder='+ Add new row'
					name='taskName'
				></input>
				<button type='submit'>Add</button>
			</form>
		</div>
	);
};

export default TableRowAdder;
