const mongoose = require('mongoose');

const Realtime = mongoose.model('Realtime', new mongoose.Schema({
    stopId: {
        type: String,
        required: true,
        index: true,
    },
    train: {
        type: String,
        required: true,
    },
    arrivalTime: Date,
    departureTime: Date,
    scheduledTrack: Number,
    actualTrack: Number,
    direction: String,
    isAssigned: Boolean,
    trainId: String,
    tripId: String,
}));
module.exports = Realtime;
