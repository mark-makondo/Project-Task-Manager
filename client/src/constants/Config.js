export const GOOGLE_CLIENT_ID = '934331962195-0k9qksgpq7j703f84o6ocf6t0unps4ll.apps.googleusercontent.com';

// ENABLE FOR DEVELOPMENT
// // socket connection
// export const SOCKET_OPTIONS = '';
// export const BACKEND_SERVER = 'http://localhost:5000';
// // axios intance
// export const AXIOS_SERVER = 'http://localhost:5000';

// ENABLE FOR PRODUCTION
// socket connection
export const SOCKET_OPTIONS = {
	// // fixes the cors error for socket io
	// transports: ['websocket'],
	// fixes the unstable emiting of data to server
	transports: ['polling'],
};
export const BACKEND_SERVER = 'http://104.236.120.68.xip.io:5000';
// axios intance
export const AXIOS_SERVER = '';
