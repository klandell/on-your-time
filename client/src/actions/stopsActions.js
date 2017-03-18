import fetch from 'isomorphic-fetch';

const C = require('Constants');

function requestStops(location) {
    return {
        type: C.REQUEST_STOPS,
        location,
    };
}

function receiveStops(location, stops) {
    return {
        type: C.RECEIVE_STOPS,
        location,
        stops,
        receivedAt: Date.now(),
    };
}

export default function loadStops(location) {
    return (dispatch) => {
        dispatch(requestStops(location));
        // TODO: use real location
        return fetch('/stops?num=10&lon=-73.9778&lat=40.7317')
            .then(response => response.json())
            .then((stops) => {
                dispatch(receiveStops(location, stops));
            });
    };
}
