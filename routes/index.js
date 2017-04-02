const path = require('path');
const express = require('express');

const router = express.Router();

// Router explicitly declaring static files to serve up
router.use('/', require('./static').router);

// API routers
router.use('/stops', require('./stops').router);
router.use('/departures', require('./departures').router);

module.exports = router;
