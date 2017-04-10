// based on https://developers.google.com/transit/gtfs/reference/calendar_dates-file
const mongoose = require('mongoose');

const CalendarDate = mongoose.model('CalendarDate', new mongoose.Schema({
    service_id: {
        type: String,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
    exception_type: {
        type: Number,
        required: true,
        min: 1,
        max: 2,
    },
}));
module.exports = CalendarDate;
