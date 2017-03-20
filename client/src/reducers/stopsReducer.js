const C = require('Constants');

export default function reducer(state = {
    isFetching: false,
    stops: [],
    location: {},
    lastUpdated: null,
    loadCount: 0,
    address: '',
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
    case C.FIND_CURRENT_LOCATION:
        return Object.assign({}, state, {
            isFetching: true,
        });
    case C.SET_LOCATION:
        return Object.assign({}, state, {
            location: action.location,
            address: action.address,
        });
    case C.CLEAR_STOPS:
        return Object.assign({}, state, {
            stops: [],
        });
    default:
        return state;
    }
}
