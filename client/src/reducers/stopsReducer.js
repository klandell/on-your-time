const C = require('Constants');

export default function reducer(state = {
    isFetching: false,
    stops: [],
    lastUpdated: null,
}, action) {
    switch (action.type) {
    case C.REQUEST_STOPS:
        return Object.assign({}, state, {
            isFetching: true,
        });
    case C.RECEIVE_STOPS:
        return Object.assign({}, state, {
            isFetching: false,
            stops: action.stops,
            lastUpdated: action.receivedAt,
        });
    default:
        return state;
    }
}
