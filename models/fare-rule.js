// based on https://developers.google.com/transit/gtfs/reference/fare_rules-file
const mongoose = require('mongoose');

const FareRule = mongoose.model('FareRule', new mongoose.Schema({
    fare_id: {
        type: String,
        unique: true,
        required: true,
    },
    route_id: String,
    origin_id: String,
    destination_id: String,
    contains_id: String,
}));
module.exports = FareRule;
