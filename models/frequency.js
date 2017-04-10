// based on https://developers.google.com/transit/gtfs/reference/frequencies-file
const mongoose = require('mongoose');

const Frequency = mongoose.model('Frequency', new mongoose.Schema({
    trip_id: {
        type: String,
        required: true,
    },
    start_time: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
        required: true,
    },
    headway_secs: {
        type: Number,
        required: true,
    },
    exact_times: {
        type: Number,
        min: 0,
        max: 1,
    },
}));
module.exports = Frequency;
