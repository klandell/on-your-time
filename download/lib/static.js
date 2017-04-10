const request = require('request');
const unzip = require('unzipper');
const csvParse = require('csv-parse');
const models = require('../../models/index');
const mongoose = require('mongoose');

// The location where we can find the static GTFS data
const STATIC_FEED = 'http://web.mta.info/developers/data/nyct/subway/google_transit.zip';

// helper variables which will be used when the import is done to add the routes
// to the stop times collection.  This will be hugely helpful when we try
// to build the list of stops near the user's location.
let stopTimes = [];
let trips = {};

/**
 * Adds the routes to the stops collection so that we can quickly get
 * figure out which trains stop at a particular stop. This should greatly
 * minimize the work needed to be done by the application server.
 */
function updateStaticRoutes() {
    const stops = {};

    // use the stopTimes array and trips object that we built during the
    // parseStaticEntry function to create the mapping from the stop
    // to the routes
    stopTimes.forEach((stopTime) => {
        const trip = trips[stopTime.trip_id];

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

    // Insert our generated data into the collection
    models.Stop.collection.bulkWrite(operations, (err) => {
        if (err) {
            throw err;
        }
        console.log('Static download finished');
    });
}

/**
 * Generically loads the data from the GTFS csv files into the required mongodb
 * collection
 * @param  {Sting} file - the csv file we just parsed
 * @param  {Arrray} docs - the data to insert into the collection
 */
function saveStaticDocs(file, docs) {
    const Model = models.getModelForFile(file);

    if (docs.length) {
        Model.collection.insert(docs);
    }
}

/**
 * Parses the entries in the static GTFS zip file
 * Each csv file is parsed, and the data is saved to mongodb
 */
function parseStaticEntry(entry) {
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

        // if the file is stop_times.txt, push the trip_id and stop_id into
        // the stopTimes array, this will help us add the routes to the stops collection
        if (file === 'stop_times.txt') {
            stopTimes.push({
                trip_id: r.trip_id,
                stop_id: r.stop_id,
            });

        // when the csv file is trips.txt, build a handy map of the file
        // this will be used later for adding the routes to the stops collection
        } else if (file === 'trips.txt') {
            trips[r.trip_id] = r.route_id;

        // to use the mongodb geospatial index, we need to format the latitude
        // and longitude in a useful way...
        } else if (file === 'stops.txt') {
            r.loc = [parseFloat(r.stop_lon), parseFloat(r.stop_lat)];
        }
        docs.push(r);
    })

    // when the csv file has been completely parsed,
    // save the data to mongodb
    .on('end', () => saveStaticDocs(file, docs));
}

/**
 * Downloads the static GTFS data from a url
 * The response is in the form of a zip file of several csv files
 * The zip file is unzipped and passed to parseStaticEntry to parse
 * the data.
 */
function downloadStaticData() {
    request(STATIC_FEED)
        .pipe(unzip.Parse())
        .on('entry', entry => parseStaticEntry(entry))
        .on('close', () => updateStaticRoutes());
}

module.exports.run = function () {
    stopTimes = [];
    trips = {};

    mongoose.connection.dropDatabase((err) => {
        if (err) {
            throw err;
        }
        downloadStaticData();
    });
};
