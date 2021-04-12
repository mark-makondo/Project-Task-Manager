import React, { useEffect } from 'react';

// ui
import Details from './Details.js';

const DetailsModalContainer = ({ isActive, setIsActive }) => {
	useEffect(() => {
		let detailsModalQuery = document.querySelector('.details-modal');

		if (detailsModalQuery) {
			if (isActive) {
				detailsModalQuery.classList.add('active');
			} else {
				detailsModalQuery.classList.remove('active');
			}

			detailsModalQuery.addEventListener('click', (e) => {
				if (e.target === detailsModalQuery) {
					setIsActive(false);
				}
			});
		}
	}, [isActive, setIsActive]);

	if (isActive) {
		return <Details />;
	}
	return <></>;
};

export default DetailsModalContainer;
