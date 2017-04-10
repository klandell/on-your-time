const mongoose = require('mongoose');

const Realtime = mongoose.model('Status', new mongoose.Schema({
    date: String,
    time: String,
    name: {
        type: String,
        index: true,
    },
    status: String,
    text: String,
}));
module.exports = Realtime;
