const express = require('express');
const mongodb = require('mongodb');
const gtfsModels = require('gtfs-mongoose');

const router = express.Router();

gtfsModels.models.Stop.collection.createIndex({ loc: '2dsphere' });
// num
// lat
// lon
router.get('/', (req, res) => {
    const query = req.query;
    const lat = parseFloat(query.lat);
    const lon = parseFloat(query.lon);
    const lastId = query.lastId;

    if (lat && lon) {
        gtfsModels.models.Stop.aggregate([
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
