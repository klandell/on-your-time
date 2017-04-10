// based on https://developers.google.com/transit/gtfs/reference/stops-file
const mongoose = require('mongoose');

const Stop = mongoose.model('Stop', new mongoose.Schema({
    stop_id: {
        type: String,
        required: true,
    },
    stop_code: String,
    stop_name: {
        type: String,
        required: true,
    },
    stop_desc: String,
    stop_lat: {
        type: Number,
        required: true,
    },
    stop_lon: {
        type: Number,
        required: true,
    },
    zone_id: String,
    stop_url: String,
    location_type: {
        type: Number,
        min: 0,
        max: 1,
    },
    parent_station: String,
    stop_timezone: String,
    wheelchair_boarding: {
        type: Number,
        min: 0,
        max: 2,
    },
    // fields not part of the specs, added to make life easier
    loc: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2dsphere',
    },
    routes: [String],
}));
module.exports = Stop;
