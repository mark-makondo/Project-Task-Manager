import React from 'react';
// ui
import Select from './Select.js';

const SelectContainer = ({ data, itemClickHandler, type, tid }) => {
	return <Select data={data} itemClickHandler={itemClickHandler} type={type} tid={tid} />;
};

export default SelectContainer;
