import fetch from 'isomorphic-fetch';
const C = require('Constants');

function requestStatuses() {
    return {
        type: C.REQUEST_STATUSES,
    };
}

function receiveStatuses(statuses) {
    return {
        type: C.RECEIVE_STATUSES,
        statuses,
        receivedAt: Date.now(),
    };
}

export function loadStatuses() {
    return (dispatch) => {
        dispatch(requestStatuses());
        return fetch('/statuses')
            .then(response => response.json())
            .then(statuses => dispatch(receiveStatuses(statuses)));
    };
}

export function leaveStatusesView() {
    return {
        type: C.LEAVE_STATUSES_VIEW,
    };
}
