/**
 * query helper to provide consistency.
 */
const query = {
	//#region NORMAL QUERY

	dashboard: () => document.querySelector('.dashboard'),

	chatSideBarContainer: () => document.querySelector('.project-container .chat-sidebar'),
	emojiPickerReact: () => document.querySelector('.emoji-picker-react'),

	notifWrapper: () => document.querySelector('.notif .wrapper'),
	notificationBellSvgWrapper: () => document.querySelector('.notif-bell-wrapper'),
	notificationBellSvg: () => document.querySelector('.notif-bell'),
	notifcationMiniBell: () => document.querySelector('.notif-bell .bell'),

	//#endregion

	//#region DROPDOWN QUERY

	// @sidebar component
	dropdownProfileSettingsContent: () => document.querySelector('.dropdown-content-profile-settings'),
	dropdownProfileSettingsButton: () => document.querySelector('.sidebar-bottom .dropdown-button'),

	dropdownCreateProjectContent: () => document.querySelector('.dropdown-content-new-project'),
	dropdownCreateProjectButton: () => document.querySelector('.sidebar-bottom__newProject button'),

	// @project page
	dropdownTableSettingsContent: () => document.querySelector('.dropdown-content-table-settings'),
	dropdownTableSettingsButton: () => document.querySelector('.table-project__title-right .fa-ellipsis-v'),

	dropdownAddMembersContent: () => document.querySelector('.dropdown-content-add-members'),
	dropdownAddMembersButton: () => document.querySelector('.table-project__title-members-add'),

	// dropdown select query for tasks: persons and status
	dropdownContentSelect: () => document.querySelector('.dropdown-content-select'),

	// @overview page
	dropdownOwnedProjectsContent: () => document.querySelector('.dropdown-content-owned-projects'),
	dropdownOwnedProjectsButton: () => document.querySelector('.overview-container__header .show-list'),

	// @navbar component
	notificationDropdown: () => document.querySelector('.notification'),
	notificationDropdownWrapper: () => document.querySelector('.notif .notification-wrapper'),

	//#endregion

	//#region MODAL QUERY

	// @sidebar
	profileModalQuery: () => document.querySelector('.profile-modal'),

	// @project page
	membersModalQuery: () => document.querySelector('.members-modal'),

	// @overview page
	overviewMembersModalQuery: () => document.querySelector('.overview-members-modal'),
	overviewTasksModalQuery: () => document.querySelector('.overview-tasks-modal'),

	// @project and overview page
	uploadedFilesModalQuery: () => document.querySelector('.uploaded-files-modal'),

	//#endregion
};

export default query;
