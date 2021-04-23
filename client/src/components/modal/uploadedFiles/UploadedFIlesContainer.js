import React, { useEffect, useState } from 'react';

// ui
import UploadedFiles from './UploadedFiles.js';

// helper
import Query from '../../../helper/query.js';

const UploadedFilesContainer = ({ data, isActive, setIsActive }) => {
	const [clicked, setClicked] = useState(false);

	const toggleCollation = (index) => {
		if (clicked === index) return setClicked(null);
		return setClicked(index);
	};

	// current modal active modifier
	useEffect(() => {
		let uploadedFilesModalQuery = Query.uploadedFilesModalQuery();

		if (uploadedFilesModalQuery) {
			if (isActive) {
				uploadedFilesModalQuery.classList.add('active');
			} else {
				uploadedFilesModalQuery.classList.remove('active');
			}

			uploadedFilesModalQuery.addEventListener('click', (e) => {
				if (e.target === uploadedFilesModalQuery) {
					setIsActive(false);
				}
			});
		}
	}, [isActive, setIsActive]);

	if (isActive) {
		return <UploadedFiles data={data} toggleCollation={toggleCollation} clicked={clicked} />;
	}
	return <></>;
};

export default UploadedFilesContainer;
