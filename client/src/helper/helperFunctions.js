import Moment from 'moment';
import jwt_decode from 'jwt-decode';
import Query from './query.js';

/**
 * A helper functions for getting the first two initials
 * of a name or any string.
 * @param {nameString} name
 * @returns
 */
export const getStringInitials = (fullname) => {
	if (fullname) {
		let fullName = fullname.split(' ');
		let initials = '';
		fullName.map((name) => {
			let splitName = name.split('');
			let shiftInitials = splitName.shift();
			let getInitials = shiftInitials.charAt(0);
			initials += getInitials;
			return initials;
		});
		return initials.substr(0, 2);
	}
	return <i className='helper-loading fas fa-spinner fa-spin'></i>;
};

/**
 * Compare two dates and returns a percent.
 * The function is based on the current date which is the date.now
 * so if we are going to test we should change the date inside of
 * our currentDate params to greater than the current date.
 *
 * @param {dateCreatedString} dateCreatedParams
 * @param {dateSetString} setDateParams
 * @returns
 */
export const getComparedDatePercent = (dateCreatedParams, setDateParams) => {
	if (setDateParams) {
		if (setDateParams !== 'N/A') {
			let dateCreated = Moment.utc(dateCreatedParams);
			let setDate = Moment.utc(setDateParams);
			let currentDate = Moment.utc();
			// let currentDate = Moment.utc('04/12/2021');

			let totalDays = setDate.diff(dateCreated, 'days');
			let remainingDays = currentDate.diff(dateCreated, 'days');

			let remainingDaysPercent = Math.round((remainingDays / totalDays) * 100);

			// console.log('dateCreated', Moment.utc(dateCreatedParams).toDate());
			// console.log('setDateParams', Moment.utc(setDateParams).toDate());

			// console.log('remainingDays', remainingDays);

			if (remainingDaysPercent > 100) {
				return 100;
			} else if (remainingDaysPercent <= 0) {
				return 0;
			} else {
				return remainingDaysPercent;
			}
		}
	}
};

/**
 * Accepts a string and returns a corresponding status color.
 *
 * @param {statusString} status
 * @returns
 */
export const getStatusColor = (status) => {
	if (status) {
		let lowerCaseStatus = status.toLowerCase();

		switch (lowerCaseStatus) {
			case 'stuck':
				return '#ff0000';
			case 'working':
				return '#6c63ff';
			case 'completed':
				return '#59df62';
			default:
				return '#fff';
		}
	}
	return <i className='helper-loading fas fa-spinner fa-spin'></i>;
};

/**
 * Validate the jwt and returns two properties:
 * isValid returns a boolean && result returns the
 * decoded jwt if isValid is true.
 */
export const decodedJwt = () => {
	let storedJwt = localStorage.jwt_token;

	let undefinedStringJwt = storedJwt === 'undefined';
	let jwtDoesntExist = storedJwt === undefined;
	let emptyJwt = storedJwt === '';

	let validJwt = !undefinedStringJwt && !jwtDoesntExist && !emptyJwt;

	if (validJwt) {
		let decode = jwt_decode(storedJwt);
		return { isValid: true, result: decode };
	}

	return { isValid: false, result: null };
};

/**
 * Make sure the click handler is placed on the 'parent' of the
 * dropdown button and dropdown content. If you want to control you dropdown
 * content from disapearing add 'focus-dropdown' in your class.
 *
 * @param {e: button event} event
 * @param {query: dropdown content query} dropdownContent
 * @param {query:  dropdown button query} dropdownButton
 */
export const dropdownHandler = (event, dropdownContent, dropdownButton) => {
	try {
		// this was used for removing of active class of our dropdown
		// when dashboard is clicked
		let dashboard = Query.dashboard();

		// the dropdown button of a dropdown must be called 'dropdown-button'.
		const isDropDownButton = event.target.classList.contains('dropdown-button');

		if (isDropDownButton) dropdownContent.classList.add('active');

		// conditional active class toggle if dropdown content is active
		if (dropdownContent.classList.contains('active')) {
			dropdownButton.classList.add('active');
		} else {
			dropdownButton.classList.remove('active');
		}

		// used for exemption of click events when removing active class
		// from dropdown content through adding 'focus-dropdown' class.
		dashboard.addEventListener('click', (e) => {
			if (dropdownContent.classList.contains('active')) {
				if (e.target.classList.contains('focus-dropdown') === false) {
					dropdownContent.classList.remove('active');
					dropdownButton.classList.remove('active');
				}
			}
		});
	} catch (error) {
		return console.log(`@Helper: Invalid parameters: ${error}`);
	}
};
