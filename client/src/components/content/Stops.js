import React from 'react';
import { connect } from 'react-redux';
import { loadStops, getCurrentLocation } from 'Actions/stopsActions';
import doNavigation from 'Actions/navigationActions';
require('Sass/content/Stops.scss');

@connect(state => state, dispatch => {
    return {
        actions: {
            loadStops,
            doNavigation,
            getCurrentLocation
        },
        dispatch
    };
})
export default class Stops extends React.Component {
    componentWillMount() {
        // load the stops near our current location
        const {actions, dispatch} = this.props;
        dispatch(actions.loadStops());
    }

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
            const {actions, dispatch} = this.props;
            dispatch(actions.doNavigation('departures', {stopId}));
        }, 150);
    }

    loadMoreStops(e) {
        this.paintSelection(e);
        const {actions, dispatch, stops} = this.props;
        const lastStop = stops.stops.slice(-1)[0];

        if (lastStop) {
            dispatch(actions.loadStops(null, lastStop.dbId, lastStop.distance));
        }
    }

    getCurrentLocation(e) {
        const {actions, dispatch} = this.props;

        if (!e.currentTarget.classList.contains('location-selected')) {
            e.currentTarget.classList.add('location-selected');
            dispatch(actions.getCurrentLocation());
        }
    }

    render() {
        const stops = this.props.stops;
        const stopItems = stops.stops.map(stop => {
            const routes = stop.routes.sort().map(route => {
                return route.slice(-1) === 'X' ? '' : <div class={`line-${route}`}>{route}</div>;
            });

            return <li
                onClick={e => this.loadDepartures(e)}
                key={stop.stopId}
                data-stopid={stop.stopId}>
                <a>
                    <span class="stop-name">{stop.stopName}</span>
                    <span class="stop-distance">{Math.round(stop.distance * 0.000621371 * 10) / 10} miles</span>
                    <div class="line-preview">{routes}</div>
                </a>
            </li>
        });

        stopItems.unshift(<li>
            <input type="text" placeholder="Search"/>
            <i onClick={e => this.getCurrentLocation(e)} class="icon ion-android-locate"></i>
        </li>);

        if (stopItems.length > 1 && stops.loadCount === 10) {
            stopItems.push(<li
                onClick={e => this.loadMoreStops(e)}
                key="more-icon"
                class="more-icon">
                <a><i class="icon ion-ios-more"></i></a>
            </li>);
        }

        return (
            <div class="stops">
                <ul>{stopItems}</ul>
            </div>
        );
    }
}
