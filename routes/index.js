const path = require('path');
const express = require('express');

const router = express.Router();


// Development router for static files
if (!process.env.NODE_ENV) {
    router.use('/', require('./dev').router);
}

// API routers
router.use('/stops', require('./stops').router);
router.use('/departures', require('./departures').router);

module.exports = router;
