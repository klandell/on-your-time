import React from 'react';
import { connect } from 'react-redux';
import { geocodeByAddress } from 'react-places-autocomplete';
import paintSelection from 'paint-selection';
import { loadStops, getCurrentLocation, setLocation, clearStops, setAddress, flagInitialLoadDone, setLastId } from 'Actions/stopsActions';
import { doNavigation, saveScroll } from 'Actions/navigationActions';
import StopsView from 'Components/stops/StopsView';

@connect(state => ({
    stops: state.stops,
    currentContent: state.currentContent,
}), dispatch => ({
    actions: {
        loadStops,
        doNavigation,
        getCurrentLocation,
        setLocation,
        setAddress,
        saveScroll,
        clearStops,
        flagInitialLoadDone,
        setLastId,
    },
    dispatch,
}))
export default class Stops extends React.Component {
    componentDidMount() {
        const { stops, actions, dispatch, currentContent } = this.props;
        const nav = document.getElementsByTagName('nav')[0];

        // scrolling the window with the fixed nav bar during the transitionName
        // leads to some unexpected behavior.  Position the nav bar as absolute
        // at the correctly scrolled location, do the scroll, and once the
        // transition is completely finished, change the nav bar back to fixed
        Object.assign(nav.style, {
            position: 'absolute',
            top: `${currentContent.scrollY}px`,
        });
        window.scrollTo(0, currentContent.scrollY);
        setTimeout(() => {
            Object.assign(nav.style, {
                position: '',
                top: '',
            });
        }, 600);

        // on the first load, set the current location to the user's gps coords
        if (!stops.initialLoadDone) {
            dispatch(actions.flagInitialLoadDone());
            dispatch(actions.getCurrentLocation());
        }
    }

    onSearchFocus() {
        window.scrollTo(0, 62);
    }

    onSearchBlur() {
        window.scrollTo(0, 0);
    }

    onGetCurrentLocClick(e) {
        const { actions, dispatch } = this.props;
        paintSelection(e, {
            color: '#CECECE',
            duration: 0.2,
        });
        dispatch(actions.getCurrentLocation());
    }

    onSuggestChange(address) {
        const { actions, dispatch } = this.props;
        dispatch(actions.setAddress(address));
    }

    onSuggestSelect(address) {
        const { actions, dispatch } = this.props;
        dispatch(actions.setAddress(address));
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

    onClearSearchClick(e) {
        const { actions, dispatch } = this.props;
        paintSelection(e, {
            color: '#CECECE',
            duration: 0.2,
        });
        dispatch(actions.clearStops());
        dispatch(actions.setAddress(''));

        // if the clear button has been clicked, refocus the search bar
        document.getElementById('stopssearch').focus();
    }

    onStopItemClick(e) {
        const currentTarget = e.currentTarget;

        paintSelection(e, {
            color: 'rgba(162, 57, 202, 0.5)',
            duration: 0.4,
        });
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
        const lastId = stops.lastId;
        const dbId = lastStop.dbId;

        if (lastStop && lastId !== dbId) {
            dispatch(actions.setLastId(dbId));
            dispatch(actions.loadStops(stops.location, lastStop.dbId, lastStop.distance));
        }

        paintSelection(e, {
            color: 'rgba(162, 57, 202, 0.5)',
            duration: 0.4,
        });
    }

    render() {
        const stops = this.props.stops;

        return (
            <StopsView
                address={stops.address}
                onGetCurrentLocClick={e => this.onGetCurrentLocClick(e)}
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
