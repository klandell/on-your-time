const express = require('express');
const gtfsModels = require('gtfs-mongoose');

const router = express.Router();

function getSubwayStatuses(req, res) {
    gtfsModels.models.Status.find({}, (err, docs) => {
        if (err) {
            throw err;
        }
        res.send(docs);
    }).sort({ name: 'asc' });
}

router.get('/', getSubwayStatuses);
module.exports.router = router;
