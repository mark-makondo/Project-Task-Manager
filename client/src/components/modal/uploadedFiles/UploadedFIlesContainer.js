import React, { useEffect, useState } from 'react';

// ui
import UploadedFiles from './UploadedFiles.js';

// helper
import Query from '../../../helper/query.js';

// this component will be used for displaying uploaded files in project and overview page.
const UploadedFilesContainer = ({ data, isActive, setIsActive, isLoading = false }) => {
	const [clicked, setClicked] = useState(false);
	const [project, setProject] = useState({});

	const toggleCollation = (index) => {
		if (clicked === index) return setClicked(null);
		return setClicked(index);
	};

	useEffect(() => {
		data && setProject(data?.project);
	}, [project, data]);

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
		return (
			<UploadedFiles project={project} toggleCollation={toggleCollation} clicked={clicked} isLoading={isLoading} />
		);
	}
	return <></>;
};

export default UploadedFilesContainer;
