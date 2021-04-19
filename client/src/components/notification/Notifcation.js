import React from 'react';

// assets
import { ReactComponent as NotifBell } from '../../assets/svg/notif-bell.svg';
import { ReactComponent as EmptyNotifBg } from '../../assets/svg/empty-notif-bg.svg';

// parts
import { TopSection } from './parts/TopSection.js';
import { BottomSection } from './parts/BottomSection.js';

const ProjectInvitationNotif = ({ notification, acceptClickHandler, declineClickHandler }) => {
	return (
		<>
			<TopSection notification={notification} />
			<BottomSection
				notification={notification}
				acceptClickHandler={acceptClickHandler}
				declineClickHandler={declineClickHandler}
			/>
		</>
	);
};

const TaskNormalNotif = ({ notification }) => {
	return <TopSection notification={notification} />;
};

const Notification = ({
	notifBellClickHandler,
	notifCount,
	notifications,
	markAllClickHandler,
	acceptClickHandler,
	declineClickHandler,
	notifSectionClickHandler,
}) => {
	return (
		<div className='notif'>
			<div className='wrapper'>
				<div className='notif-bell-wrapper' data-count={notifCount}>
					<NotifBell onClick={notifBellClickHandler} className='notif-bell' width='100%' height='100%' />
				</div>
			</div>
			<div className='notification hide'>
				<header className='notification-header'>
					<span className='notification-header__title'> notifications</span>
					<div className='notification-header__mark'>
						<span>Mark All</span>
						<i onClick={(e) => markAllClickHandler(e)} className='fas fa-check normal-1'></i>
					</div>
				</header>
				<div className='notification-wrapper'>
					{notifications && notifications.length !== 0 ? (
						[...notifications].reverse().map((notification) => (
							<section
								onClick={(e) => notifSectionClickHandler(e)}
								data-nid={notification._id}
								data-type={notification.type}
								key={notification._id}
								className={`section  normal-3 section-${notification._id} ${
									(notification.response !== 'none') | notification.hasRead && 'marked-as-read'
								}`}
							>
								<div className='section-wrapper'>
									{notification.type === 'invite' ? (
										<ProjectInvitationNotif
											notification={notification}
											acceptClickHandler={acceptClickHandler}
											declineClickHandler={declineClickHandler}
										/>
									) : (
										<TaskNormalNotif notification={notification} />
									)}
								</div>
							</section>
						))
					) : (
						<EmptyNotifBg />
					)}
				</div>
			</div>
		</div>
	);
};

export default Notification;
