const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

router.use('/stops', require('./stops').router);
router.use('/departures', require('./departures').router);

// TODO: make this better...
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', req.url));
});

module.exports = router;
