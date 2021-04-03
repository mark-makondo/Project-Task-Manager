import React, { useState } from 'react';

// ui
import TableOverview from './TableOverview.js';

// modal components
import DetailsModalContainer from '../../modal/detailsModal/DetailsModalContainer.js';

const TableOverviewContainer = ({ project, img, text }) => {
	const [isDetailsModalActive, setIsDetailsModalActive] = useState(false);

	const messageClickHandler = () => {};

	const dropdownClickHandler = (e) => {
		// get data-id attribute
		let id = e.currentTarget.dataset.id;

		// query with id
		let dropdownContentQuery = document.querySelector(
			`.dropdown.details .dropdown-content-${id}`
		);
		let dropdownButtonQuery = document.querySelector(
			`.dropdown.details .dropdown-button-${id}`
		);

		// toggle active on dropdown content
		dropdownContentQuery.classList.toggle('active');

		// conditional active class toggle if dropdown content is active
		if (dropdownContentQuery.classList.contains('active')) {
			dropdownButtonQuery.classList.add('active');
		} else {
			dropdownButtonQuery.classList.remove('active');

			// remove focus when active class is removed
			e.currentTarget.blur();
		}

		// remove focus when clicked outside of the container
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
			<TableOverview
				project={project}
				img={img}
				text={text}
				messageClickHandler={messageClickHandler}
				dropdownClickHandler={dropdownClickHandler}
				detailsModalClickHandler={detailsModalClickHandler}
			/>
			<DetailsModalContainer
				isActive={isDetailsModalActive}
				setIsActive={setIsDetailsModalActive}
			/>
		</>
	);
};

export default TableOverviewContainer;
