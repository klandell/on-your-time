// based on https://developers.google.com/transit/gtfs/reference/feed_info-file
const mongoose = require('mongoose');

const FeedInfo = mongoose.model('FeedInfo', new mongoose.Schema({
    feed_publisher_name: {
        type: String,
        required: true,
    },
    feed_publisher_url: {
        type: String,
        required: true,
    },
    feed_lang: {
        type: String,
        required: true,
    },
    feed_start_date: Number,
    feed_end_date: Number,
    feed_version: String,
}));
module.exports = FeedInfo;
