import React from 'react';

const Select = ({ data, itemClickHandler }) => {
	return (
		<div className='dropdown-content-select'>
			{data.map((item, i) => (
				<li data-id={item.id} key={`${item.data}-${i}`} onClick={(e) => itemClickHandler(e)}>
					{item.data}
				</li>
			))}
		</div>
	);
};

export default Select;
