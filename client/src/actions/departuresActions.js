import fetch from 'isomorphic-fetch';

const C = require('Constants');

function requestDepartures(stopId, direction) {
    return {
        type: C.REQUEST_DEPARTURES,
        stopId,
        direction,
    };
}

function receiveDepartures(stopId, direction, departures) {
    return {
        type: C.RECEIVE_DEPARTURES,
        stopId,
        direction,
        departures,
        receivedAt: Date.now(),
    };
}

export function loadDepartures(stopId, direction) {
    return (dispatch) => {
        dispatch(requestDepartures(stopId, direction));
        return fetch(`/departures?stopId=${stopId}&direction=${direction}`)
            .then(response => response.json())
            .then((departures) => {
                dispatch(receiveDepartures(stopId, direction, departures));
            });
    };
}

export function leaveDeparturesView() {
    return {
        type: C.LEAVE_DEPARTURES_VIEW,
    };
}
