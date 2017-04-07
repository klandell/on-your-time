const rp = require('request-promise');
const gtfsModels = require('gtfs-mongoose');
const parseXML = require('xml2js').parseString;

const STATUS_FEED = 'http://web.mta.info/status/serviceStatus.txt';

/**
 * Parses the status xml returned from the MTA feed and loads it
 * into the mongodb collection `status`
 */
function parseStatusData(response) {
    parseXML(response, (err, result) => {
        if (err) {
            console.log(err);
            return;
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
}

/**
 * The MTA updates an xml document of the current transit status every minute.
 * We need to go to grab that document and extract the subway data so that it
 * can be loaded into our database.
 */
module.exports.run = function () {
    rp(STATUS_FEED)
        .then(response => parseStatusData(response));
};
