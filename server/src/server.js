require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Mongoose = require('./mongodb.js');

const userRoutes = require('./routes/UserRouters');
const projectRoutes = require('./routes/ProjectRouters');

const mongoose = new Mongoose();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use('/api/auth/user', userRoutes);
app.use('/api/auth/project', projectRoutes);

mongoose.run(app, PORT);
