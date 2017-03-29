const C = require('Constants');

export default function reducer(state = {
    isFetching: false,
    stopId: null,
    direction: null,
    departures: [],
    lastUpdated: null,
}, action) {
    switch (action.type) {
    case C.REQUEST_DEPARTURES:
        return Object.assign({}, state, {
            isFetching: true,
            stopId: action.stopId,
            direction: action.direction,
        });
    case C.RECEIVE_DEPARTURES:
        return Object.assign({}, state, {
            isFetching: false,
            departures: action.departures,
            lastUpdated: action.receivedAt,
        });
    case C.LEAVE_DEPARTURES_VIEW:
        return Object.assign({}, state, {
            departures: [],
            direction: null,
        });
    default:
        return state;
    }
}
