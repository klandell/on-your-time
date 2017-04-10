// based on https://developers.google.com/transit/gtfs/reference/agency-file
const mongoose = require('mongoose');

const Agency = mongoose.model('Agency', new mongoose.Schema({
    agency_id: {
        type: String,
        unique: true,
    },
    agency_name: {
        type: String,
        required: true,
    },
    agency_url: {
        type: String,
        required: true,
    },
    agency_timezone: {
        type: String,
        required: true,
    },
    agency_lang: String,
    agency_phone: String,
    agency_fare_url: String,
    agency_email: String,
}));
module.exports = Agency;
