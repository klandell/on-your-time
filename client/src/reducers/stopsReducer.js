const C = require('Constants');

export default function reducer(state = {
    isFetching: false,
    stops: [],
    lastUpdated: null,
    loadCount: 0,
}, action) {
    switch (action.type) {
    case C.REQUEST_STOPS:
        return Object.assign({}, state, {
            isFetching: true,
        });
    case C.RECEIVE_STOPS:
        return Object.assign({}, state, {
            isFetching: false,
            stops: state.stops.concat(action.stops),
            lastUpdated: action.receivedAt,
            loadCount: action.stops.length,
        });
    case C.RECEIVE_STOPS_CLEAR:
        // same as receive stops except it overwites existing stops
        return Object.assign({}, state, {
            isFetching: false,
            stops: action.stops,
            lastUpdated: action.receivedAt,
            loadCount: action.stops.length,
        });
    default:
        return state;
    }
}
