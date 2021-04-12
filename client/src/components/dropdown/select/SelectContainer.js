import React from 'react';

// ui
import Select from './Select.js';

const SelectContainer = ({ data, itemClickHandler }) => {
	return <Select data={data} itemClickHandler={itemClickHandler} />;
};

export default SelectContainer;
