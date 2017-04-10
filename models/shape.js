// based on https://developers.google.com/transit/gtfs/reference/shapes-file
const mongoose = require('mongoose');

const Shape = mongoose.model('Shape', new mongoose.Schema({
    shape_id: {
        type: String,
        required: true,
    },
    shape_pt_lat: {
        type: Number,
        required: true,
    },
    shape_pt_lon: {
        type: Number,
        required: true,
    },
    shape_pt_sequence: {
        type: Number,
        required: true,
    },
    shape_dist_traveled: Number,
}));
module.exports = Shape;
