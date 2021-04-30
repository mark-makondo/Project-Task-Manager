export const GOOGLE_CLIENT_ID = '934331962195-07tm801pc16s9a59n2pvcdokmsr1odah.apps.googleusercontent.com';

// // ENABLE FOR DEVELOPMENT
// // socket connection
// export const SOCKET_OPTIONS = '';
// export const BACKEND_SERVER = 'http://localhost:5000';
// // axios instance
// export const AXIOS_SERVER = 'http://localhost:5000';

// ENABLE FOR PRODUCTION
// socket connection
export const SOCKET_OPTIONS = {
	// // fixes the cors error for socket io
	// transports: ['websocket'],
	// fixes the unstable emiting of data to server also firefox compatibility
	transports: ['polling'],
};

// export const BACKEND_SERVER = 'http://104.236.120.68.xip.io:5000';
// alternative if xip.io is down
export const BACKEND_SERVER = 'http://104.236.120.68.nip.io:5000';

// axios instance
export const AXIOS_SERVER = '';
