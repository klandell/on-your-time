/* eslint global-require: 0 */

// Map the GTFS files to their mongoose model
const modelMap = {
    'agency.txt': 'Agency',
    'calendar.txt': 'Calendar',
    'calendar_dates.txt': 'CalendarDate',
    'fare_attribues.txt': 'FareAttribute',
    'fare_rules.txt': 'FareRule',
    'feed_info.txt': 'FeedInfo',
    'frequencies.txt': 'Frequency',
    'routes.txt': 'Route',
    'shapes.txt': 'Shape',
    'stops.txt': 'Stop',
    'stop_times.txt': 'StopTime',
    'transfers.txt': 'Transfer',
    'trips.txt': 'Trip',
};

module.exports = {
    Agency: require('./agency'),
    CalendarDate: require('./calendar-date'),
    Calendar: require('./calendar'),
    FareAttribute: require('./fare-attribute'),
    FareRule: require('./fare-rule'),
    FeedInfo: require('./feed-info'),
    Frequency: require('./frequency'),
    Realtime: require('./realtime'),
    Route: require('./route'),
    Shape: require('./shape'),
    Status: require('./status'),
    StopTime: require('./stop-time'),
    Stop: require('./stop'),
    Transfer: require('./transfer'),
    Trip: require('./trip'),

    /**
     * Returns the the model that matches a given GTFS spec file
     */
    getModelForFile(file) {
        return this.models[modelMap[file]];
    },
};
