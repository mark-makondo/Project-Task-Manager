import axios from 'axios';
import { BACKEND_SERVER } from '../constants/SocketConnection.js';

const axiosInstance = (history = null) => {
	const baseURL = `${BACKEND_SERVER}/api/auth`;

	let headers = {};

	if (localStorage.jwt_token) {
		headers.jwt_token = `${localStorage.jwt_token}`;
	}

	const axiosInstance = axios.create({
		baseURL: baseURL,
		headers,
	});

	axiosInstance.interceptors.response.use(
		(response) =>
			new Promise((resolve, reject) => {
				resolve(response);
			}),
		(error) => {
			if (!error.response) {
				return new Promise((resolve, reject) => {
					reject(error);
				});
			} // if error not on server

			if (error.response.status === 401 || error.response.status === 500) {
				localStorage.removeItem('jwt_token');

				if (history) {
					history.push('/');
				} // redirect to login if response is true
			} else {
				return new Promise((resolve, reject) => {
					reject(error);
				});
			} // if response is forbidden
		}
	); // this runs if the token is being edited manually // if there is error then it goes to base path

	return axiosInstance;
};

export default axiosInstance;
