import React from 'react';

const CustomButton = ({ content, customClass, onClick, pid }) => {
	return (
		<button data-pid={pid} onClick={(e) => onClick(e)} className={`overview-container__buttons ${customClass}`}>
			{content}
		</button>
	);
};

export default CustomButton;
