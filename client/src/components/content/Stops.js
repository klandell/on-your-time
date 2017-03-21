import React from 'react';
import { connect } from 'react-redux';
import Geosuggest from 'react-geosuggest';
import { loadStops, getCurrentLocation, setLocation, clearAddress } from 'Actions/stopsActions';
import doNavigation from 'Actions/navigationActions';
require('Sass/content/Stops.scss');

@connect(state => state, dispatch => {
    return {
        actions: {
            loadStops,
            doNavigation,
            getCurrentLocation,
            setLocation,
            clearAddress
        },
        dispatch
    };
})
export default class Stops extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    paintSelection(e) {
        const currentTarget = e.currentTarget;
        const max = Math.max(currentTarget.clientWidth, currentTarget.clientHeight);
        let ink = currentTarget.querySelector('.ink');

        if (!ink) {
            ink = document.createElement('span');
            ink.style.height = `${max}px`;
            ink.style.width = `${max}px`;
            ink.classList.add('ink');
            currentTarget.insertBefore(ink, currentTarget.firstChild);
        }

        ink.classList.remove('animate');
        ink.style.top = `${e.pageY - currentTarget.offsetTop - max / 2}px`;
        ink.style.left = `${e.pageX - currentTarget.offsetLeft - max / 2}px`;
        ink.classList.add('animate');

        setTimeout(() => ink.classList.remove('animate'), 650);
    }

    loadDepartures(e) {
        const currentTarget = e.currentTarget;

        this.paintSelection(e);

        // give the selection animation some time to propagate
        setTimeout(() => {
            const stopId = currentTarget.getAttribute('data-stopid');
            const stopName = currentTarget.querySelector('.stop-name').innerHTML;
            const {actions, dispatch} = this.props;
            dispatch(actions.doNavigation('departures', {stopId, stopName}));
        }, 150);
    }

    loadMoreStops(e) {
        this.paintSelection(e);
        const {actions, dispatch, stops} = this.props;
        const lastStop = stops.stops.slice(-1)[0];

        if (lastStop) {
            dispatch(actions.loadStops(stops.location, lastStop.dbId, lastStop.distance));
        }
    }

    getCurrentLocation(e) {
        const {actions, dispatch} = this.props;

        if (!e.currentTarget.classList.contains('location-selected')) {
            e.currentTarget.classList.add('location-selected');
            dispatch(actions.getCurrentLocation());
        }
    }

    onSuggestSelect(suggest) {
        const {actions, dispatch} = this.props;
        const location = suggest.location;
        let loc = { coords: {} };

        if (location) {
            loc = {
                coords: {
                    latitude: location.lat,
                    longitude: location.lng,
                },
                address: suggest.label
            };
        }
        dispatch(actions.setLocation(loc));
    }

    onClearSearchClick() {
        const {actions, dispatch} = this.props;
            dispatch(actions.clearAddress());
    }

    render() {
        const stops = this.props.stops;
        const stopItems = stops.stops.map(stop => {
            const routes = stop.routes.sort().map(route => {
                if (route === 'GS') {
                    route = 'S';
                } else if (route === 'H') {
                    route = '';
                }
                return !route || route.slice(-1) === 'X' ? '' : <div class={`line-${route}`}>{route}</div>;
            });

            return <li
                onClick={e => this.loadDepartures(e)}
                key={stop.stopId}
                data-stopid={stop.stopId}
                class="stop-item">
                <a>
                    <span class="stop-name">{stop.stopName}</span>
                    <span class="stop-distance">{Math.round(stop.distance * 0.000621371 * 10) / 10} miles</span>
                    <div class="line-preview">{routes}</div>
                </a>
            </li>
        });

        //stopItems.unshift(<li>
        //    <input type="text" placeholder="Search"/>
        //    <i onClick={e => this.getCurrentLocation(e)} class="icon ion-android-locate"></i>
        //</li>);
        //</

        // NYC bounds
        const bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(40.477399, -74.259090),
            new google.maps.LatLng(40.917577, -73.700272)
        );

        if (stopItems.length > 1 && stops.loadCount === 10) {
            stopItems.push(<li
                onClick={e => this.loadMoreStops(e)}
                key="more-icon"
                class="stop-item more-icon">
                <a><i class="icon ion-ios-more"></i></a>
            </li>);
        }

        return (
            <div class="stops">
                <i class="icon ion-close" onClick={() => this.onClearSearchClick()}></i>
                <Geosuggest
                    initialValue={this.props.stops.address}
                    bounds={bounds}
                    onSuggestSelect={suggest => this.onSuggestSelect(suggest)}
                    // TODO: real location via location prop
                    //location={new google.maps.LatLng(40.7316777, -73.9795155)}
                />
                <ul>{stopItems}</ul>
            </div>
        );
    }
}
