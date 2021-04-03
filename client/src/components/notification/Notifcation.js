import React from 'react';

// assets
import { ReactComponent as NotifBell } from '../../assets/svg/notif-bell.svg';
const Notification = ({ notifBellClickHandler, notifMessage }) => {
	return (
		<div className='notif'>
			<div className='wrapper hide'>
				<div className='notif-bell-wrapper' data-count={notifMessage?.length}>
					<NotifBell
						onClick={notifBellClickHandler}
						className='notif-bell'
						width='100%'
						height='100%'
					/>
				</div>
			</div>
			<div className='notification hide'>
				{notifMessage &&
					notifMessage.map((data, i) => (
						<div key={i} className={`section section-${i}`}>
							<div className='text one'>
								<span>{data.message}</span>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default Notification;
