const express = require('express');
const gtfsModels = require('gtfs-mongoose');

const router = express.Router();

router.get('/', (req, res) => {
    const stopId = req.query.stopId;
    const direction = req.query.direction;

    if (stopId && direction) {
        const search = new RegExp(`^${stopId}[NS]?$`);

        gtfsModels.models.Realtime.find({ stopId: search, direction }, (err, docs) => {
            res.send(docs.map(doc => ({
                train: doc.train,
                arrivalTime: doc.arrivalTime,
                departureTime: doc.departureTime,
                isRealtime: true,
            })));
        }).sort({ departureTime: 'asc' });
    }
});
module.exports.router = router;
