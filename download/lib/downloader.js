const rp = require('request-promise');
const GTFSBindings = require('mta-gtfs-realtime-bindings');
const Promise = require('bluebird');
const request = require('request');
const unzip = require('unzipper');
const csvParse = require('csv-parse');
const gtfsModels = require('gtfs-mongoose');
const mongoose = require('mongoose');
const parseString = require('xml2js').parseString;

const { MONGODB_USER, MONGODB_PASS, MONGODB_HOST, MONGODB_PORT, MONGODB_DB } = process.env;
mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`);

module.exports = {
    /**
     * The url to download the GTFS static data from the MTA
     * @return {String}
     */
    get staticFeed() {
        return 'http://web.mta.info/developers/data/nyct/subway/google_transit.zip';
    },

    /**
     * An array of promises to load data from the multiple MTA realtime data feeds
     * @return {Array}
     */
    get realtimePromises() {
        const feedUrl = 'http://datamine.mta.info/mta_esi.php';
        // Id codes for the MTA Realtime feed data
        // 1:  trains 1,2,3,4,5,6
        // 2:  train  L
        // 11: trains N,Q,R,W
        // 16: trains N,Q,R,W
        // 21: trains B,D
        const feedIds = [1, 2, 11, 16, 21];
        return feedIds.map(feedId => rp({
            method: 'GET',
            url: `${feedUrl}?key=${process.env.MTA_TOKEN}&feed_id=${feedId}`,
            encoding: null,
        }));
    },

    get statusFeed() {
        return 'http://web.mta.info/status/serviceStatus.txt';
    },

    /**
     * Executes the download of the staic and realtime transit data
     */
    doDownload(all) {
        console.log('Download Process started');

        if (all) {
            mongoose.connection.dropDatabase((err) => {
                if (err) {
                    throw err;
                }
                console.log('Old Data Deleted');

                this.downloadStaticData(this.staticFeed);
                this.doRealtimeDownload();
                this.doStatusDownload();
            });
        } else {
            this.doRealtimeDownload();
            this.doStatusDownload();
        }
    },

    doRealtimeDownload() {
        this.downloadRealtimeData(this.realtimePromises);
        setInterval(() => this.downloadRealtimeData(this.realtimePromises), 30 * 1000);
    },

    doStatusDownload() {
        this.downloadStatusData();
        setInterval(() => this.downloadStatusData(), 60 * 1000);
    },

    downloadStatusData() {
        rp(this.statusFeed)
        .then(response => this.parseStatusData(response));
    },

    parseStatusData(response) {
        parseString(response, (err, result) => {
            if (err) {
                throw err;
            }
            const lines = result.service.subway[0].line;
            lines.map(l => ({
                date: l.Date[0],
                time: l.Time[0],
                name: l.name[0],
                status: l.status[0],
                text: l.text[0],
            }));

            gtfsModels.models.Status.remove((removeErr) => {
                if (removeErr) {
                    throw removeErr;
                }
                gtfsModels.models.Status.collection.insert(lines);
                console.log('MTA status data downloaded');
            });
        });
    },

    /**
     * Downloads the static GTFS data from a url
     * The response is in the form of a zip file of several csv files
     * The zip file is unzipped and passed to parseStaticEntry to parse
     * the data.
     */
    downloadStaticData(url) {
        request(url)
        .pipe(unzip.Parse())
        .on('entry', entry => this.parseStaticEntry(entry))
        .on('close', () => this.updateStaticRoutes());
    },

    /**
     * Parses the entries in the static GTFS zip file
     * Each csv file is parsed, and the data is saved to mongodb
     */
    parseStaticEntry(entry) {
        const file = entry.path;
        const docs = [];

        console.log(`importing ${file}`);
        // parse the csv file
        // errors were thrown with relax_column_count: false
        entry.pipe(csvParse({
            relax_column_count: true,
            columns: true,
        }))

        // build an array of all the documents that make up
        // the rows of the csv file
        .on('data', (row) => {
            const r = row;
            if (file === 'stop_times.txt') {
                this.stopTimes.push({
                    trip_id: r.trip_id,
                    stop_id: r.stop_id,
                });
            } else if (file === 'trips.txt') {
                this.trips[r.trip_id] = r.route_id;
            } else if (file === 'stops.txt') {
                r.loc = [parseFloat(r.stop_lon), parseFloat(r.stop_lat)];
            }
            docs.push(r);
        })

        // when the csv file has been completely parsed,
        // save the data to mongodb
        .on('end', () => this.saveStaticDocs(file, docs));
    },

    /**
     * TODO: this documentation
     */
    saveStaticDocs(file, docs) {
        const Model = gtfsModels.getModelForFile(file);

        if (docs.length) {
            Model.collection.insert(docs)
            .catch((err) => {
                console.error(err.message);
            });
        }
    },

    stopTimes: [],
    trips: {},

    updateStaticRoutes() {
        const stops = {};

        this.stopTimes.forEach((stopTime) => {
            const trip = this.trips[stopTime.trip_id];

            if (trip) {
                const stopId = stopTime.stop_id.slice(0, -1);
                stops[stopId] = stops[stopId] || [];
                if (stops[stopId].indexOf(trip) === -1) {
                    stops[stopId].push(trip);
                }
            }
        });

        const operations = Object.keys(stops).map(k => ({
            updateOne: {
                filter: { stop_id: k },
                update: { $set: { routes: stops[k] } },
                upsert: false,
            },
        }));
        gtfsModels.models.Stop.collection.bulkWrite(operations, (err) => {
            if (err) {
                throw err;
            }
            console.log('Static download finished');
        });
    },

    downloadRealtimeData(feeds) {
        Promise.all(feeds)
            .spread((...gtfs) => {
                gtfsModels.models.Realtime.remove((removeErr) => {
                    if (removeErr) {
                        throw removeErr;
                    }
                    const data = [].concat(...this.decodeReltimeGTFS(gtfs));
                    gtfsModels.models.Realtime.collection.insert(data);
                    console.log('MTA realtime data downloaded');
                });
            })
            // If any errors occur, just log them to the console.
            // We are excluding any errors that occur when decoding
            // the gtfs data since we know it is often corrupted.
            .catch(e => console.log(e));
    },

    decodeReltimeGTFS(gtfs) {
        const decoded = [];

        gtfs.forEach((buf) => {
            try {
                const feed = GTFSBindings.transit_realtime.FeedMessage.decode(buf);
                decoded.push(this.extractRealtimeData(feed));
            } catch (e) {
                // It isn't uncommon for the feed to be corrupted
                // catch the error and ignore it
            }
        });
        return decoded;
    },

    extractRealtimeData(feed) {
        const data = [];

        if (feed) {
            feed.entity.forEach((entity) => {
                if (!entity.is_deleted && entity.trip_update) {
                    data.push(...this.getStopTimes(entity));
                }
            });
        }
        return data;
    },

    getStopTimes(entity) {
        const data = [];
        const tripUpdate = entity.trip_update;
        const trip = tripUpdate.trip;
        const nyctDescriptor = trip.nyct_trip_descriptor;

        tripUpdate.stop_time_update.forEach((stop) => {
            data.push({
                train: trip.route_id,
                stopId: stop.stop_id,
                arrivalTime: stop.arrival ? stop.arrival.time.low * 1000 : null,
                departureTime: stop.departure ? stop.departure.time.low * 1000 : null,
                scheduledTrack: stop.nyct_stop_time_update.scheduled_track,
                actualTrack: stop.nyct_stop_time_update.actual_track,
                direction: `${nyctDescriptor.direction}`,
                isAssigned: nyctDescriptor.is_assigned,
                trainId: nyctDescriptor.train_id,
                tripId: trip.trip_id,
            });
        });
        return data;
    },
};
