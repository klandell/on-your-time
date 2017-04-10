// based on https://developers.google.com/transit/gtfs/reference/trips-file
const mongoose = require('mongoose');

const Trip = mongoose.model('Trip', new mongoose.Schema({
    route_id: {
        type: String,
        required: true,
    },
    service_id: {
        type: String,
        required: true,
    },
    trip_id: {
        type: String,
        unique: true,
        required: true,
    },
    trip_headsign: String,
    trip_short_name: String,
    direction_id: {
        type: Number,
        min: 0,
        max: 1,
    },
    block_id: String,
    shape_id: String,
    wheelchair_accessible: {
        type: Number,
        min: 0,
        max: 2,
    },
    bikes_allowed: {
        type: Number,
        min: 0,
        max: 2,
    },
}));
module.exports = Trip;
