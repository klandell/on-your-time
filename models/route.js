// based on https://developers.google.com/transit/gtfs/reference/routes-file
const mongoose = require('mongoose');

const Route = mongoose.model('Route', new mongoose.Schema({
    route_id: {
        type: String,
        unique: true,
        required: true,
    },
    agency_id: String,
    route_short_name: {
        type: String,
        required: true,
    },
    route_long_name: {
        type: String,
        required: true,
    },
    route_desc: String,
    route_type: {
        type: Number,
        min: 0,
        max: 7,
        required: true,
    },
    route_url: String,
    route_color: String,
    route_text_color: String,
}));
module.exports = Route;
