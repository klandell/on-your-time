const C = require('Constants');

export default function reducer(state = {
    isFetching: false,
    statuses: [],
    lastUpdated: null,
}, action) {
    switch (action.type) {
    case C.REQUEST_STATUSES:
        return Object.assign({}, state, {
            isFetching: true,
        });
    case C.RECEIVE_STATUSES:
        return Object.assign({}, state, {
            isFetching: false,
            statuses: action.statuses,
            lastUpdated: action.receivedAt,
        });
    case C.LEAVE_STATUSES_VIEW:
        return Object.assign({}, state, {
            statuses: [],
        });
    default:
        return state;
    }
}
