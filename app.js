// load environment variables from the .env file
require('dotenv').config();

// reqire module dependencies
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const app = express();

// use verbose logging when running in development mode
app.use(logger(!process.env.NODE_ENV ? 'dev' : 'short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// TODO: switch over to router
//app.use('/', index);
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    next((err.status = 404) && err);
});

// handle errors
app.use(function(err, req, res, next) {
    const isDev = !process.env.NODE_ENV;
    const body = {
        message: err.message,
        status: err.status,
        stack: err.stack
    };
    res.status(err.status || 500);
    res.json(body);
});

module.exports = app;
