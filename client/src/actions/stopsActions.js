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

export function setLastId(lastId) {
    return {
        type: C.SET_LAST_ID,
        lastId,
    };
}

export function flagInitialLoadDone() {
    return {
        type: C.FLAG_INITIAL_LOAD_DONE,
    };
}

export function clearStops() {
    return {
        type: C.CLEAR_STOPS,
    };
}

export function setAddress(address) {
    return {
        type: C.SET_ADDRESS,
        address,
    };
}

export function clearLoading() {
    return {
        type: C.CLEAR_LOADING,
    };
}

export function loadStops(location = {
    latitude: 40.7317,
    longitude: -73.9778,
}, lastId = null, minDistance) {
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
        });
    };
}

export function geocodeLocation(position) {
    return (dispatch) => {
        const coords = position.coords;
        const latlng = { lat: coords.latitude, lng: coords.longitude };
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK') {
                const found = results[0];

                if (found) {
                    dispatch(setAddress(found.formatted_address));
                } else {
                    dispatch(setAddress(''));
                }
            }
        });
    };
}

export function getCurrentLocation() {
    return (dispatch) => {
        if (navigator.geolocation) {
            dispatch(findCurrentLocation());
            navigator.geolocation.getCurrentPosition((position) => {
                dispatch(setLocation(position));
                dispatch(geocodeLocation(position));
            }, () => {
                dispatch(clearLoading());
            });
        }
    };
}
