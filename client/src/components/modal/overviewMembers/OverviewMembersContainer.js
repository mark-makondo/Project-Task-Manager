import React, { useEffect } from 'react';

// ui
import OverviewMembers from './OverviewMembers.js';

// helper
import Query from '../../../helper/query.js';

const OverviewMembersContainer = ({ data, isLoading, isActive, setIsActive }) => {
	// current modal active modifier
	useEffect(() => {
		let overviewMembersModalQuery = Query.overviewMembersModalQuery();

		if (overviewMembersModalQuery) {
			if (isActive) {
				overviewMembersModalQuery.classList.add('active');
			} else {
				overviewMembersModalQuery.classList.remove('active');
			}

			overviewMembersModalQuery.addEventListener('click', (e) => {
				if (e.target === overviewMembersModalQuery) {
					setIsActive(false);
				}
			});
		}
	}, [isActive, setIsActive]);

	if (isActive) {
		return <OverviewMembers data={data} isLoading={isLoading} />;
	}
	return <></>;
};

export default OverviewMembersContainer;
