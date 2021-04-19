require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const Mongoose = require('./mongodb.js');
const socket = require('socket.io');
const path = require('path');

const config = require('../config');
const userRoutes = require('./routes/UserRouters');
const projectRoutes = require('./routes/ProjectRouters');

const mongoose = new Mongoose();
const app = express();

const server = http.createServer(app);

const io = socket(server, {
	cors: {
		origin: config.socket.CLIENT_ORIGIN,
		methods: ['GET', 'POST'],
	},
});

require('./socket/root')(io);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.use('/api/auth/user', userRoutes);
app.use('/api/auth/project', projectRoutes);

exports.io = io;
mongoose.run(server, PORT);

// for google drive development only! remove when finished developing
const googleDriveTesting = async () => {
	// test
	const Google = require('./googledrive');

	let google = new Google();
	await google.init();

	let id = '1dfO7O0qKVD9SEBl6PZle99B1oj31tLEv';
	// await google.deleteResource(id);
	// let parentFolderName = 'PTM-606ed6d16e35644970789c28';
	// let folderName = 'testing';

	// await google.createFolderAndMoveWithPermission(folderName, parentFolderName);
	// await google.createPermission;
	// let link = await google.generatePublicUrl(id);
	// console.log(link);
	// await google.deleteResource(id);
	// console.log(test);

	// let verif = await google.verifyCapabilitiesOrPermission(id, 'permission', 'lan.turnover@gmail.com');

	// let capa = await google.verifyCapabilitiesOrPermission('1p72Gkq4Mrz98ayuWwJT8pG8QXOQ53S6f', 'capabilities');

	// let get = await google.verifyCapabilitiesOrPermission(id, 'capabilities');
	// let lists = await google.listFiles();

	// delete all // btter than google drive
	let lists = await google.listFiles();
	// for await (file of lists) {
	// 	let res = await google.verifyCapabilitiesOrPermission(file.id, 'capabilities');
	// 	if (res.capabilities.canDelete === true) {
	// 		await google.deleteResource(file.id);
	// 	}
	// }

	// let res = await google.findAllAndDelete();
	// console.log(lists);
	// console.log('deleting', res);
};

// googleDriveTesting();
