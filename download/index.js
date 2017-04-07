require('dotenv').config();
const mongoose = require('mongoose');

const realtimeDownloader = require('./lib/realtime');
const staticDownloader = require('./lib/static');
const statusDownloader = require('./lib/status');

const { MONGODB_USER, MONGODB_PASS, MONGODB_HOST, MONGODB_PORT, MONGODB_DB } = process.env;
mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`);

const downloadStatic = process.argv[2] === 'static';

if (downloadStatic) {
    // when doing a static download, don't do anything else
    staticDownloader.run();
} else {
    // download the data right away
    realtimeDownloader.run();
    statusDownloader.run();

    // set up intervals that will download the MTA data on a loop forever
    // this will be deployed to a server to continuouslty populate our db
    setInterval(() => realtimeDownloader.run(), 30 * 1000);
    setInterval(() => statusDownloader.run(), 60 * 1000);
}
