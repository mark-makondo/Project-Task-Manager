import React, { useState } from 'react';

// ui
import TableTemplate from './TableTemplate.js';

// modal components
import DetailsModalContainer from '../../modal/detailsModal/DetailsModalContainer.js';

const TableTemplateContainer = ({ project, originalData }) => {
	const [isDetailsModalActive, setIsDetailsModalActive] = useState(false);

	const messageClickHandler = () => {};

	const dropdownClickHandler = (e) => {
		let id = e.currentTarget.dataset.id;

		let dropdownContentQuery = document.querySelector(`.dropdown.details .dropdown-content-${id}`);
		let dropdownButtonQuery = document.querySelector(`.dropdown.details .dropdown-button-${id}`);

		dropdownContentQuery.classList.toggle('active');

		if (dropdownContentQuery.classList.contains('active')) {
			dropdownButtonQuery.classList.add('active');
		} else {
			dropdownButtonQuery.classList.remove('active');
			e.currentTarget.blur();
		}

		e.currentTarget.addEventListener('blur', () => {
			dropdownContentQuery.classList.remove('active');
			dropdownButtonQuery.classList.remove('active');
		});
	};

	const detailsModalClickHandler = () => {
		setIsDetailsModalActive(!isDetailsModalActive);
	};

	return (
		<>
			<TableTemplate
				project={project}
				originalData={originalData}
				messageClickHandler={messageClickHandler}
				dropdownClickHandler={dropdownClickHandler}
				detailsModalClickHandler={detailsModalClickHandler}
			/>
			<DetailsModalContainer isActive={isDetailsModalActive} setIsActive={setIsDetailsModalActive} />
		</>
	);
};

export default TableTemplateContainer;
