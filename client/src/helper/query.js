/**
 * query helper to provide consistency.
 */
const query = {
	// dashboard query
	dashboard: () => document.querySelector('.dashboard'),

	// dropdown query for profile settings @sidebar
	dropdownProfileSettingsContent: () =>
		document.querySelector('.dropdown-content-profile-settings'),
	dropdownProfileSettingsButton: () =>
		document.querySelector('.sidebar-bottom .dropdown-button'),

	// dropdown query for creating project @sidebar
	dropdownCreateProjectContent: () =>
		document.querySelector('.dropdown-content-new-project'),
	dropdownCreateProjectButton: () =>
		document.querySelector('.sidebar-top__newProject button'),

	// more here
};

export default query;
