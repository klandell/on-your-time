import React from 'react';
import { connect } from 'react-redux';
import { geocodeByAddress } from 'react-places-autocomplete';
import paintSelection from 'paint-selection';
import { loadStops, getCurrentLocation, setLocation, clearStops, setAddress, saveScroll } from 'Actions/stopsActions';
import doNavigation from 'Actions/navigationActions';
import StopsView from 'Components/stops/StopsView';

@connect(state => state, dispatch => ({
    actions: {
        loadStops,
        doNavigation,
        getCurrentLocation,
        setLocation,
        setAddress,
        saveScroll,
        clearStops,
    },
    dispatch,
}))
export default class Stops extends React.Component {
    componentDidMount() {
        const scrollY = this.props.stops.scrollY;
        window.scrollTo(0, scrollY);
    }

    onSearchFocus(e) {
        window.scrollTo(0, 60);
    }

    onSearchBlur(e) {
        window.scrollTo(0, 0);
    }

    // not currently in use
    // getCurrentLocation(e) {
    //    const { actions, dispatch } = this.props;
    //
    //    if (!e.currentTarget.classList.contains('location-selected')) {
    //        e.currentTarget.classList.add('location-selected');
    //        dispatch(actions.getCurrentLocation());
    //    }
    //
    //
    onSuggestChange(address) {
        const { actions, dispatch } = this.props;
        dispatch(actions.setAddress(address));
    }

    onSuggestSelect(address) {
        const { actions, dispatch } = this.props;
        dispatch(actions.setAddress(address));

        // TODO: loadmask while geocoding
        geocodeByAddress(address, (err, latLon) => this.setLocation(err, latLon));
    }

    setLocation(err, { lat, lng }) {
        if (!err) {
            const { actions, dispatch } = this.props;
            let loc = { coords: {} };

            loc = {
                coords: {
                    latitude: lat,
                    longitude: lng,
                },
            };
            dispatch(actions.setLocation(loc));
        }
    }

    onClearSearchClick() {
        const { actions, dispatch } = this.props;
        dispatch(actions.clearStops());
        dispatch(actions.setAddress(''));
    }

    onStopItemClick(e) {
        const currentTarget = e.currentTarget;

        paintSelection(e);
        this.saveScroll();
        // give the selection animation some time to propagate
        setTimeout(() => {
            const stopId = currentTarget.getAttribute('data-stopid');
            const stopName = currentTarget.querySelector('.stop-name').innerHTML;
            const { actions, dispatch } = this.props;
            dispatch(actions.doNavigation('departures', { stopId, stopName }));
        }, 150);
    }

    saveScroll() {
        const { actions, dispatch } = this.props;
        const doc = document.documentElement;
        const scrollY = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        dispatch(actions.saveScroll(scrollY));
    }

    onMoreClick(e) {
        const { actions, dispatch, stops } = this.props;
        const lastStop = stops.stops.slice(-1)[0];

        if (lastStop) {
            dispatch(actions.loadStops(stops.location, lastStop.dbId, lastStop.distance));
        }
        paintSelection(e);
    }

    render() {
        const stops = this.props.stops;

        return (
            <StopsView
                address={stops.address}
                onSearchFocus={e => this.onSearchFocus(e)}
                onSearchBlur={e => this.onSearchBlur(e)}
                onSuggestChange={e => this.onSuggestChange(e)}
                onSuggestSelect={e => this.onSuggestSelect(e)}
                onClearSearchClick={e => this.onClearSearchClick(e)}
                stops={stops.stops}
                loadCount={stops.loadCount}
                onStopItemClick={e => this.onStopItemClick(e)}
                onMoreClick={e => this.onMoreClick(e)}/>
        );
    }
}
