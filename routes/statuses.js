const express = require('express');
const gtfsModels = require('gtfs-mongoose');

const Status = gtfsModels.models.Status;

const router = express.Router();
Status.collection.createIndex({ name: 1 });

/**
 * Get the status info for the various subway lines
 */
function getSubwayStatuses(req, res) {
    Status.find({}, (err, docs) => {
        if (err) {
            throw err;
        }
        res.send(docs);
    }).sort({ name: 'asc' });
}

router.get('/', getSubwayStatuses);
module.exports.router = router;
