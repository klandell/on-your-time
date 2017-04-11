const C = require('Constants');

export default function reducer(state = {
    isFetching: false,
    stops: [],
    location: {},
    lastUpdated: null,
    loadCount: 0,
    address: '',
    initialLoadDone: false,
    lastId: null,
}, action) {
    switch (action.type) {
    case C.FLAG_INITIAL_LOAD_DONE:
        return Object.assign({}, state, {
            initialLoadDone: true,
        });
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
        });
    case C.CLEAR_STOPS:
        return Object.assign({}, state, {
            stops: [],
        });
    case C.SET_ADDRESS:
        return Object.assign({}, state, {
            address: action.address,
        });
    case C.CLEAR_LOADING:
        return Object.assign({}, state, {
            isFetching: false,
        });
    case C.SET_LAST_ID:
        return Object.assign({}, state, {
            lastId: action.lastId,
        });
    default:
        return state;
    }
}
