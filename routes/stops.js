const express = require('express');
const mongoose = require('mongoose');
const gtfsModels = require('gtfs-mongoose');

const router = express.Router();

mongoose.connect('mongodb://localhost:27017/gtfs');
gtfsModels.models.Stop.collection.ensureIndex({ loc: '2dsphere' });

// num
// lat
// lon
router.get('/', (req, res) => {
    const query = req.query;

    if (query.lat && query.lon) {
        gtfsModels.models.Stop.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(query.lon), parseFloat(query.lat)],
                    },
                    num: 10,
                    spherical: true,
                    distanceField: 'distance',
                    minDistance: parseFloat(query.minDistance) || 0,
                    query: {
                        _id: {
                            $nin: [query.lastId || null],
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
