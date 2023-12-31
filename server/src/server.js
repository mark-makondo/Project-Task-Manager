const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../', '.env') });

const http = require('http');
const express = require('express');
const cors = require('cors');
const Mongoose = require('./mongodb.js');
const socket = require('socket.io');

const config = require('../config');
const userRoutes = require('./routes/UserRouters');
const projectRoutes = require('./routes/ProjectRouters');

const mongoose = new Mongoose();
const app = express();

const server = http.createServer(app);

const io = socket(server, {
	cors: {
		origin: config.socket.ALL,
		methods: ['GET', 'POST'],
	},
	// production
	transports: ['polling'],
});

require('./socket/root')(io);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.use('/api/auth/user', userRoutes);
app.use('/api/auth/project', projectRoutes);

// production
app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../', '../', 'client', 'build', 'index.html'));
});

exports.io = io;
mongoose.run(server, PORT);
