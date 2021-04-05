import React from 'react';
import Moment from 'moment';

const TableProjectHeader = () => {
	return (
		<div className='table-project__header'>
			{/* <div className='table-project__title-name normal-1'>{project.projectName}</div>
			<div className='table-project__title-right'>
				<div className='table-project__title-avatar normal-2'>
					<span>Owner: </span>
					<figure>
						<div className='avatar avatar-global'>
							{img ? (
								<img src='' alt='' />
							) : (
								<span>{getStringInitials(project.owner)}</span>
							)}
						</div>
						<figcaption>You</figcaption>
					</figure>
				</div>
				<div
					onClick={(e) => dropdownClickHandler(e)}
					className={`dropdown details dropdown-${project.id}`}
					data-id={project.id}
					tabIndex='-1'
				>
					<i
						className={`fas fa-ellipsis-v normal-1 dropdown-button dropdown-button-${project.id}`}
					></i>
					<div className={`dropdown-content dropdown-content-${project.id}`}>
						<span onClick={(e) => detailsModalClickHandler(e)}>Details</span>
					</div>
				</div>
			</div> */}
		</div>
	);
};

const TableProject = ({ urlParams }) => {
	return (
		<div className='table-project'>
			<h1>{urlParams.name}</h1>
			<TableProjectHeader />
			<div className='table-project__content normal-2'></div>
		</div>
	);
};

export default TableProject;
