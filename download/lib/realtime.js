const rp = require('request-promise');
const Promise = require('bluebird');
const Realtime = require('../../models/realtime');
const GTFSBindings = require('mta-gtfs-realtime-bindings');

// constants defining the various MTA realtime feeds
const BASE_FEED = 'http://datamine.mta.info/mta_esi.php';
const FEED_IDS = [1, 2, 11, 16, 21];

// generate promises for the MTA feeds
const realtimePromises = FEED_IDS.map(id => rp({
    method: 'GET',
    url: `${BASE_FEED}?key=${process.env.MTA_TOKEN}&feed_id=${id}`,
    encoding: null,
}));

/**
 * Map the returned GTFS data to a usable format
 * @param  {Object} entity - A GTFS reamtime entity
 * @return {Array} An array of stop times
 */
function getStopTimes(entity) {
    const tripUpdate = entity.trip_update;
    const trip = tripUpdate.trip;
    const nyctDescriptor = trip.nyct_trip_descriptor;

    return tripUpdate.stop_time_update.map(stop => ({
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
    }));
}

/**
 * Conditionally gets the stop time data for a feed of entities based on
 * if the entity is deleted and if it has any trip updates
 * @param  {Array} feed - An array of realtime entities
 * @return {Array} A modified feed with only relevant items
 */
function extractRealtimeData(feed) {
    const data = [];

    if (feed) {
        feed.entity.forEach((entity) => {
            if (!entity.is_deleted && entity.trip_update) {
                data.push(...getStopTimes(entity));
            }
        });
    }
    return data;
}

/**
 * Decode the GTFS realtime data using a proto buffer generated from MTA specs
 * @param  {Buffer} gtfs - A buffer of GTFS data
 * @return {Array} A decoded array of GTFS data
 */
function decodeRealtimeGTFS(gtfs) {
    const decoded = [];

    gtfs.forEach((buf) => {
        try {
            const feed = GTFSBindings.transit_realtime.FeedMessage.decode(buf);
            decoded.push(extractRealtimeData(feed));
        } catch (e) {
            // It isn't uncommon for the feed to be corrupted
            // catch the error and ignore it
        }
    });
    return decoded;
}

/**
 * Deletes the existing realtime data, builds the new data, and re-inserts it
 * @param  {Array} gtfs - An array of GTFS data
 */
function onGTFSLoaded(...gtfs) {
    Realtime.remove((err) => {
        if (err) {
            throw err;
        }
        const data = [].concat(...decodeRealtimeGTFS(gtfs));
        Realtime.collection.insert(data);
        console.log('MTA realtime data downloaded');
    });
}

/**
 * Executes a download of the MTA GTFS feed
 * The MTA drops a zip file of the realtime data onto their server
 * every 30 seconds. We need to grab the zip file, decode the data,
 * and load it into our mongodb instance so that it is available from our
 * rest api
 */
module.exports.run = function () {
    Promise.all(realtimePromises)
        .spread(response => onGTFSLoaded(response))
        // If any errors occur, just log them to the console.
        // We are excluding any errors that occur when decoding
        // the gtfs data since we know it is often corrupted.
        .catch(e => console.log(e));
};
