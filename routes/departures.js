const express = require('express');
const gtfsModels = require('gtfs-mongoose');

const router = express.Router();

function getScheduledDepartures(req, res) {
    debugger;
    res.send([]);
}

function getRealtimeDepartures(req, res) {
    const stopId = req.query.stopId;
    const direction = req.query.direction;
    const search = new RegExp(`^${stopId}[NS]?$`);

    gtfsModels.models.Realtime.find({ stopId: search, direction }, (err, docs) => {
        const now = new Date().getTime();
        const departures = docs.filter((doc) => {
            const arrivalTime = doc.arrivalTime;
            const departureTime = doc.departureTime;
            return (departureTime || arrivalTime).getTime() >= now;
        }).map(doc => ({
            train: doc.train,
            isRealtime: true,
            arrivalTime: doc.arrivalTime,
            departureTime: doc.departureTime,
        }));

        if (departures.length) {
            res.send(departures);
        } else {
            getScheduledDepartures(req, res);
        }
    }).sort({ departureTime: 'asc' });
}

router.get('/', getRealtimeDepartures);
module.exports.router = router;
