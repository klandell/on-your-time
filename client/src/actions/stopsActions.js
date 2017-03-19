import fetch from 'isomorphic-fetch';

const C = require('Constants');

function requestStops(location) {
    return {
        type: C.REQUEST_STOPS,
        location,
    };
}

function receiveStops(location, stops, clear) {
    return {
        type: clear ? C.RECEIVE_STOPS_CLEAR : C.RECEIVE_STOPS,
        location,
        stops,
        receivedAt: Date.now(),
    };
}

export default function loadStops(location, lastId, minDistance) {
    return (dispatch) => {
        dispatch(requestStops(location));
        // TODO: use real location
        return fetch(`/stops?lon=-73.9778&lat=40.7317${lastId ? `&lastId=${lastId}&minDistance=${minDistance}` : ''}`)
            .then(response => response.json())
            .then((stops) => {
                dispatch(receiveStops(location, stops, !lastId));
            });
    };
}

// minDistance
// lastId
