// based on https://developers.google.com/transit/gtfs/reference/transfers-file
const mongoose = require('mongoose');

const Transfer = mongoose.model('Transfer', new mongoose.Schema({
    from_stop_id: {
        type: String,
        required: true,
    },
    to_stop_id: {
        type: String,
        required: true,
    },
    transfer_type: {
        type: Number,
        min: 0,
        max: 3,
        required: true,
    },
    min_transfer_time: Number,
}));
module.exports = Transfer;
