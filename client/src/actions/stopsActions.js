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

function findCurrentLocation() {
    return {
        type: C.FIND_CURRENT_LOCATION,
    };
}

export function loadStops(location = {
    latitude: 40.7317,
    longitude: -73.9778,
}, lastId, minDistance) {
    return (dispatch) => {
        dispatch(requestStops(location));
        return fetch(`/stops?lon=${location.longitude}&lat=${location.latitude}${lastId ? `&lastId=${lastId}&minDistance=${minDistance}` : ''}`)
            .then(response => response.json())
            .then((stops) => {
                dispatch(receiveStops(location, stops, !lastId));
            });
    };
}

export function setLocation(position) {
    return (dispatch) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (latitude && longitude) {
            dispatch(loadStops({ latitude, longitude }));
        }
    };
}

export function getCurrentLocation() {
    return (dispatch) => {
        if (navigator.geolocation) {
            dispatch(findCurrentLocation());
            navigator.geolocation.getCurrentPosition(position => dispatch(setLocation(position)));
        }
    };
}
