import React, { useEffect } from 'react';

// ui
import DetailsModal from './DetailsModal.js';

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
		return <DetailsModal />;
	}
	return <></>;
};

export default DetailsModalContainer;
