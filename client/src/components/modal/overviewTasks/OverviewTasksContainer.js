import React, { useCallback, useEffect, useState } from 'react';

// ui
import OverviewTasks from './OverviewTasks.js';

// helper
import Query from '../../../helper/query.js';

const OverviewTasksContainer = ({ data, isLoading, isActive, setIsActive }) => {
	const [completedStatus, setCompletedStatus] = useState([]);
	const [workingStatus, setWorkingStatus] = useState([]);
	const [stuckStatus, setStuckStatus] = useState([]);
	const [emptyStatus, setEmptyStatus] = useState([]);
	const [clicked, setClicked] = useState(false);

	// calculated logic state
	const taskStatusIdentifier = useCallback(
		(status) => {
			let isProject = data && data.project;

			let tasks = isProject?.tasks
				.map((task) => {
					return task;
				})
				.filter((task) => {
					return task.status === status;
				});

			return tasks;
		},
		[data]
	);

	useEffect(() => {
		setCompletedStatus(taskStatusIdentifier('completed'));
		setWorkingStatus(taskStatusIdentifier('working'));
		setStuckStatus(taskStatusIdentifier('stuck'));
		setEmptyStatus(taskStatusIdentifier(''));
	}, [taskStatusIdentifier]);

	const toggleCollation = (index) => {
		if (clicked === index) return setClicked(null);
		return setClicked(index);
	};

	//#endregion

	// current modal active modifier
	useEffect(() => {
		let overviewTasksModalQuery = Query.overviewTasksModalQuery();

		if (overviewTasksModalQuery) {
			if (isActive) {
				overviewTasksModalQuery.classList.add('active');
			} else {
				overviewTasksModalQuery.classList.remove('active');
			}

			overviewTasksModalQuery.addEventListener('click', (e) => {
				if (e.target === overviewTasksModalQuery) {
					setIsActive(false);
				}
			});
		}
	}, [isActive, setIsActive]);

	if (isActive) {
		return (
			<OverviewTasks
				data={data}
				isLoading={isLoading}
				completedStatus={completedStatus}
				workingStatus={workingStatus}
				stuckStatus={stuckStatus}
				emptyStatus={emptyStatus}
				toggleCollation={toggleCollation}
				clicked={clicked}
			/>
		);
	}
	return <></>;
};

export default OverviewTasksContainer;
