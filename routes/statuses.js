const express = require('express');
const gtfsModels = require('gtfs-mongoose');

const router = express.Router();

gtfsModels.models.Status.collection.createIndex({ name: 1 });

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
