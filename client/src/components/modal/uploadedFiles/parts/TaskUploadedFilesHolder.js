import React from 'react';

// helper
import { ToggleArrow } from '../../../../helper/helperFunctions.js';

const TaskUploadedFilesHolder = ({ toggleCollation, clicked, indexName, lists }) => {
	return (
		<section className={`uploaded-files-modal-body__tasks`}>
			<div onClick={() => toggleCollation(indexName)} className='file-upload-info'>
				<span>
					<strong>{indexName}</strong>
				</span>
				<span>- {lists.length === 0 ? 'no uploads.' : lists && `${lists.length} uploads.`}</span>
				<ToggleArrow click={clicked} name={indexName} />
			</div>
			<ul className='file-upload-list'>
				{lists &&
					lists.length !== 0 &&
					lists.map((file) =>
						clicked === indexName ? (
							<li key={file._id} className='normal-3'>
								<span className='file-upload-list__name' title={file.fileName}>
									<a className='normal-3' href={file.googleViewLink}>
										{file.fileName}
									</a>
								</span>
								<span title='Click to Download.'>
									<a className='file-upload-list__viewlink' href={file.googleDownloadLink}>
										<i className='fas fa-save'></i>
									</a>
								</span>
								<span title='Click to view link.'>
									<a className='file-upload-list__downloadlink' href={file.googleViewLink}>
										<i className='fas fa-eye'></i>
									</a>
								</span>
							</li>
						) : null
					)}
			</ul>
		</section>
	);
};

export default TaskUploadedFilesHolder;
