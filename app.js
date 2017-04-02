// load environment variables from the .env file
require('dotenv').config();

// reqire module dependencies
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const index = require('./routes');
const mongoose = require('mongoose');

// instantiate the express app
const app = express();

// connect to the gtfs database
const { MONGODB_USER, MONGODB_PASS, MONGODB_HOST, MONGODB_PORT, MONGODB_DB } = process.env;
mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`);

// use verbose logging when running in development mode
app.use(logger(!process.env.NODE_ENV ? 'dev' : 'short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use('/', index);

// Throw 404 if router isn't found
app.use((req, res, next) => {
    const err = new Error('Not Found');
    next((err.status = 404) && err);
});

// Default error router
app.use((err, req, res, next) => {
    const isDev = !process.env.NODE_ENV;
    const body = {
        message: err.message,
        status: err.status,
        stack: isDev ? err.stack : null,
    };
    res.status(err.status || 500);
    res.json(body);
});

module.exports = app;
