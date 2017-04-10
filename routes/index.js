const express = require('express');

const router = express.Router();

// Router explicitly declaring static files to serve up
router.use('/', require('./static').router);

// API routers
router.use('/departures', require('./departures').router);
router.use('/statuses', require('./statuses').router);
router.use('/stops', require('./stops').router);

module.exports = router;
