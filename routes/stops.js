const express = require('express');
const mongodb = require('mongodb');
const gtfsModels = require('gtfs-mongoose');

const Stop = gtfsModels.models.Stop;
const router = express.Router();
Stop.collection.createIndex({ loc: '2dsphere' });

// Find the nearest subways stations to a latitude and longitude.
// This query is paged, with a page size of 10 stops.
router.get('/', (req, res) => {
    const query = req.query;
    const lat = parseFloat(query.lat);
    const lon = parseFloat(query.lon);
    const lastId = query.lastId;

    if (lat && lon) {
        Stop.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [lon, lat],
                    },
                    num: 10,
                    spherical: true,
                    distanceField: 'distance',
                    minDistance: parseFloat(query.minDistance) || 0,
                    query: {
                        _id: {
                            $nin: [lastId ? mongodb.ObjectID(lastId) : null],
                        },
                        stop_id: /[^NS]$/,
                    },
                },
            },
        ], (err, docs) => {
            res.send(docs.map(doc => ({
                dbId: doc._id,
                stopName: doc.stop_name,
                stopId: doc.stop_id,
                distance: doc.distance,
                routes: doc.routes || [],
            })));
        });
    } else {
        res.send('coordinates required');
    }
});
module.exports.router = router;
