const express = require('express');
const gtfsModels = require('gtfs-mongoose');

const StopTime = gtfsModels.models.StopTime;
const Realtime = gtfsModels.models.Realtime;
const router = express.Router();

// Ensure the indexes required for rapid queries of the database exist.
// These indexes should be created by mongoose. However, due to the large
// amount of data being inserted during the download process, we insert
// the data directly into the database without utilizing the capabilities
// of mongoose.
StopTime.collection.createIndex({ stop_id: 1 });
Realtime.collection.createIndex({ stopId: 1 });

function getScheduledDepartures(req, res) {
    const stopId = req.query.stopId;
    const direction = req.query.direction;
    const search = new RegExp(`^${stopId}${direction === '1' ? 'N' : 'S'}$`);

    // Search the schedule collection
    StopTime.find({ stop_id: search }, (err, docs) => {
        const now = (new Date()).getTime();
        const departureTime = new Date();
        const HOUR = 60 * 60 * 1000;
        const DAY = 24 * 60 * 60 * 1000;
        const departures = [];
        const usedIds = {};

        docs.forEach((doc) => {
            const departureTimeAry = doc.departure_time.split(':');

            // set 24 hours to 0 so the date doesn't keep rolling forward
            departureTimeAry[0] = +departureTimeAry[0] % 24;

            // convert string times to date object
            // We try to only show the departure time on the client
            // and since both the departure time and arrival time
            // are required in the GTFS specs we can safely just use
            // the departure time
            departureTime.setHours(+departureTimeAry[0]);
            departureTime.setMinutes(+departureTimeAry[1]);
            let time = departureTime.getTime();

            const diff = time - now;
            const tomorrowDiff = (time + DAY) - now;

            // only show departures for the next 2 hours
            if ((diff >= 0 && diff <= (HOUR * 2)) || (diff < 0 && tomorrowDiff <= (HOUR * 2))) {
                const train = doc.trip_id.match(/_(\w{1,2})\./)[1];

                if (diff < 0) {
                    time += DAY;
                }

                const key = `${train}-${direction}-${time}`;

                if (!usedIds[key]) {
                    departures.push({
                        train,
                        isRealtime: false,
                        arrivalTime: time,
                        departureTime: time,
                    });
                    // add the departure time to a map so that identical trinas
                    usedIds[key] = true;
                }
            }
        });

        departures.sort((a, b) => a.departureTime - b.departureTime);
        res.send(departures);
    });
}

function getRealtimeDepartures(req, res) {
    const stopId = req.query.stopId;
    const direction = req.query.direction;
    const search = new RegExp(`^${stopId}${direction === '1' ? 'N' : 'S'}$`);

    // Look for any departues for this station in the realtime collection.
    // If nothing is found we have to fall back to the static GTFS data.
    // It isn't ideal, but we are severely limited by the MTA's capabilities.
    Realtime.find({ stopId: search }, (err, docs) => {
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
