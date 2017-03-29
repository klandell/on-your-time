const path = require('path');
const express = require('express');

const router = express.Router();

// Default router
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// Router for client js code
router.get('/bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'bundle.js'));
});

// API routers
router.use('/stops', require('./stops').router);
router.use('/departures', require('./departures').router);

module.exports = router;
