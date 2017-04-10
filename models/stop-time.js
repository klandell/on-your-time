// based on https://developers.google.com/transit/gtfs/reference/stop_times-file
const mongoose = require('mongoose');

const StopTime = mongoose.model('StopTime', new mongoose.Schema({
    trip_id: {
        type: String,
        required: true,
    },
    arrival_time: {
        type: String,
        required: true,
    },
    departure_time: {
        type: String,
        required: true,
    },
    stop_id: {
        type: String,
        required: true,
        index: true,
    },
    stop_sequence: {
        type: Number,
        required: true,
    },
    stop_headsign: String,
    pickup_type: {
        type: Number,
        min: 0,
        max: 3,
    },
    drop_off_type: {
        type: Number,
        min: 0,
        max: 3,
    },
    shape_dist_traveled: Number,
    timepoint: {
        type: Number,
        min: 0,
        max: 1,
    },
}));
module.exports = StopTime;
