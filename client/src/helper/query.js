/**
 * query helper to provide consistency.
 */
const query = {
	// dashboard query
	dashboard: () => document.querySelector('.dashboard'),

	// dropdown query for profile settings @sidebar
	dropdownProfileSettingsContent: () => document.querySelector('.dropdown-content-profile-settings'),
	dropdownProfileSettingsButton: () => document.querySelector('.sidebar-bottom .dropdown-button'),

	// dropdown query for creating project @sidebar
	dropdownCreateProjectContent: () => document.querySelector('.dropdown-content-new-project'),
	dropdownCreateProjectButton: () => document.querySelector('.sidebar-top__newProject button'),

	// dropdown query for creating project @sidebar
	dropdownTableSettingsContent: () => document.querySelector('.dropdown-content-table-settings'),
	dropdownTableSettingsButton: () => document.querySelector('.table-project__title-right .fa-ellipsis-v'),

	// dropdown select component for tasks @dashboard project
	dropdownContentSelect: () => document.querySelector('.dropdown-content-select'),

	// dropdown add members component for project @ dashboard project
	dropdownAddMembersContent: () => document.querySelector('.dropdown-content-add-members'),
	dropdownAddMembersButton: () => document.querySelector('.table-project__title-members-add'),

	// emojipicker @chat sidebar
	emojiPickerReact: () => document.querySelector('.emoji-picker-react'),

	// chat sidebar @dashboard
	chatSideBarContainer: () => document.querySelector('.project-container .chat-sidebar'),

	// notification bell svg
	notifWrapper: () => document.querySelector('.notif .wrapper'),
	notificationBellSvgWrapper: () => document.querySelector('.notif-bell-wrapper'),
	notificationBellSvg: () => document.querySelector('.notif-bell'),
	notifcationMiniBell: () => document.querySelector('.notif-bell .bell'),

	// notification dropdown @navbar
	notificationDropdown: () => document.querySelector('.notification'),
	notificationDropdownWrapper: () => document.querySelector('.notif .notification-wrapper'),

	// details modal container @tableSettingsContainer
	detailsModalQuery: () => document.querySelector('.details-modal'),

	// more here
};

export default query;
