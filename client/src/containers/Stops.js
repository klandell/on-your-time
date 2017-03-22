import React from 'react';
import { connect } from 'react-redux';
import { loadStops, getCurrentLocation, setLocation, clearAddress } from 'Actions/stopsActions';
import doNavigation from 'Actions/navigationActions';
import StopsView from 'Components/stops/StopsView';
require('Sass/containers/Stops.scss');

@connect(state => state, dispatch => ({
    actions: {
        loadStops,
        doNavigation,
        getCurrentLocation,
        setLocation,
        clearAddress,
    },
    dispatch,
}))
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
            const { actions, dispatch } = this.props;
            dispatch(actions.doNavigation('departures', { stopId, stopName }));
        }, 150);
    }

    loadMoreStops(e) {
        this.paintSelection(e);
        const { actions, dispatch, stops } = this.props;
        const lastStop = stops.stops.slice(-1)[0];

        if (lastStop) {
            dispatch(actions.loadStops(stops.location, lastStop.dbId, lastStop.distance));
        }
    }

    getCurrentLocation(e) {
        const { actions, dispatch } = this.props;

        if (!e.currentTarget.classList.contains('location-selected')) {
            e.currentTarget.classList.add('location-selected');
            dispatch(actions.getCurrentLocation());
        }
    }

    onSuggestSelect(suggest) {
        const { actions, dispatch } = this.props;
        const location = suggest.location;
        let loc = { coords: {} };

        if (location) {
            loc = {
                coords: {
                    latitude: location.lat,
                    longitude: location.lng,
                },
                address: suggest.label,
            };
        }
        dispatch(actions.setLocation(loc));
    }

    onClearSearchClick() {
        const { actions, dispatch } = this.props;
        dispatch(actions.clearAddress());
    }

    onStopItemClick() {
        debugger;
    }

    render() {
        const stops = this.props.stops;

        return (
            <StopsView
                address={stops.address}
                onSuggestSelect={e => this.onSuggestSelect(e)}
                onClearSearchClick={e => this.onClearSearchClick(e)}
                stops={stops.stops}
                onStopItemClick={e => this.onStopItemClick(e)} />
        );
    }
}
