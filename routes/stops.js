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
                    num: parseInt(query.num, 10) || 5,
                    spherical: true,
                    distanceField: 'distance',
                    distanceMultiplier: 0.000621371,
                    maxDistance: 8046.72, // 5 mile max
                    query: { stop_id: /[^NS]$/ },
                },
            },
        ], (err, docs) => {
            res.send(docs.map(doc => ({
                stopName: doc.stop_name,
                stopId: doc.stop_id,
                distance: Math.round(doc.distance * 10) / 10,
                routes: doc.routes,
            })));
        });
    } else {
        res.send('coordinates required');
    }
});
module.exports.router = router;
