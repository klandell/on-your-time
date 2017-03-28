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

function clearStops() {
    return {
        type: C.CLEAR_STOPS,
    };
}

export function clearAddress() {
    return {
        type: C.CLEAR_ADDRESS,
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

export function setLocation(loc) {
    return (dispatch) => {
        const latitude = loc.coords.latitude;
        const longitude = loc.coords.longitude;
        let location;

        if (latitude && longitude) {
            dispatch(loadStops({ latitude, longitude }));
            location = {
                latitude,
                longitude,
            };
        } else {
            dispatch(clearStops());
        }

        dispatch({
            type: C.SET_LOCATION,
            location,
            // TODO: move into location info
            address: loc.address,
        });
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

export function saveScroll(scrollY) {
    return {
        type: C.SAVE_SCROLL,
        scrollY,
    };
}
