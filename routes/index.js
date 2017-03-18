const express = require('express');


const router = express.Router();

// router.get('/', (req, res) => {
//    res.send('home');
// });

router.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

router.use('/stops', require('./stops').router);
router.use('/times', require('./times').router);

module.exports = router;
