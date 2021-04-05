require('dotenv').config();

// initialize modules
const express = require('express');
const cors = require('cors');
const Mongoose = require('./mongodb.js');

// require routes
const userRoutes = require('./routes/UserRouters');

// assign modules to variables
const mongoose = new Mongoose();
const app = express();

// config incomming data type using express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// port 5000 will be used in development mode
const PORT = process.env.PORT || 5000;

app.use('/api/auth/user', userRoutes);

// run mongo db class
mongoose.run(app, PORT);
