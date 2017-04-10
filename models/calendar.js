// based on https://developers.google.com/transit/gtfs/reference/calendar-file
const mongoose = require('mongoose');

const Calendar = mongoose.model('Calendar', new mongoose.Schema({
    service_id: {
        type: String,
        unique: true,
        required: true,
    },
    monday: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    tuesday: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    wednesday: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    thursday: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    friday: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    saturday: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    sunday: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    start_date: {
        type: Number,
        required: true,
    },
    end_date: {
        type: Number,
        required: true,
    },
}));
module.exports = Calendar;
