// based on https://developers.google.com/transit/gtfs/reference/fare_attributes-file
const mongoose = require('mongoose');

const FareAttribute = mongoose.model('FareAttribute', new mongoose.Schema({
    fare_id: {
        type: String,
        unique: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    currency_type: {
        type: String,
        required: true,
    },
    payment_method: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    transfers: {
        type: Number,
        min: 0,
        max: 2,
        required: true,
    },
    transfer_duration: Number,
}));
module.exports = FareAttribute;
