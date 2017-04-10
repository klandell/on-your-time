const path = require('path');
const express = require('express');

const router = express.Router();

// Default router
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Router for an explicit index.html
router.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// favicon router
router.use('/favicons', (req, res) => {
    res.sendFile(path.join(__dirname, '../favicons', req.url));
});

// Router for service workers
router.get('/sw.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../sw.js'));
});

// appcache router
router.use('/appcache', (req, res) => {
    res.sendFile(path.join(__dirname, '../appcache', req.url));
});

// Router for client js code
router.get('/bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../bundle.js'));
});

// Router for vendor js code
router.get('/vendor.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../vendor.js'));
});

// Router for manifest js code
router.get('/manifest.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../manifest.js'));
});

module.exports.router = router;
