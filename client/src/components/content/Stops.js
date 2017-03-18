import React from 'react';
import { connect } from 'react-redux';
import loadStops from 'Actions/stopsActions';
import doNavigation from 'Actions/navigationActions';

@connect(state => state, dispatch => {
    return {
        actions: {
            loadStops,
            doNavigation
        },
        dispatch
    };
})
export default class Calculator extends React.Component {
    componentWillMount() {
        // load the stops near our current location
        const {actions, dispatch} = this.props;
        dispatch(actions.loadStops());
    }
    
    loadDepartures(e) {
        const stopId = e.target.getAttribute('data-stopid');
        const {actions, dispatch} = this.props;
        dispatch(actions.doNavigation('departures', {stopId}));
    }

    render() {
        const stops = this.props.stops.stops;
        const stopItems = stops.map(stop => {
            return <li
                onClick={e => this.loadDepartures(e)}
                key={stop.stopId}
                data-stopid={stop.stopId}>
                {stop.stopName}</li>
        });
        return (
            <ul class="stops">{stopItems}</ul>
        );
    }
}
