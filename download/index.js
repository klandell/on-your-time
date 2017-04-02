require('dotenv').config();
require('./lib/downloader').doDownload();


/* const gtfsModels = require('gtfs-mongoose');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gtfs');

gtfsModels.models.Stop.collection.ensureIndex({ loc: '2dsphere' });
gtfsModels.models.Stop.aggregate([
    {
        $geoNear: {
            near: {
                type: 'Point',
                // coordinates: [-73.9778, 40.7317],
                coordinates: [-74.056534, 40.292012],
            },
            num: 5,
            spherical: true,
            distanceField: 'distance',
            distanceMultiplier: 0.000621371,
            maxDistance: 3218.69,
        },
    },
], (err, docs) => { console.log(docs[0] && docs[0].distance); });*/
