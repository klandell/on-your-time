import React from 'react';
import { connect } from 'react-redux';
import loadStops from 'Actions/stopsActions';
import doNavigation from 'Actions/navigationActions';
require('Sass/content/Stops.scss');

@connect(state => state, dispatch => {
    return {
        actions: {
            loadStops,
            doNavigation
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

    loadDepartures(e) {
        const stopId = e.currentTarget.getAttribute('data-stopid');
        const {actions, dispatch} = this.props;
        dispatch(actions.doNavigation('departures', {stopId}));
    }

    render() {
        const stops = this.props.stops.stops;
        const stopItems = stops.map(stop => {
            const routes = stop.routes.sort().map(route => {
                return route.slice(-1) === 'X' ? '' : <div class={`line-${route}`}>{route}</div>;
            });

            return <li
                onClick={e => this.loadDepartures(e)}
                key={stop.stopId}
                data-stopid={stop.stopId}>
                <div>
                    <span class="stop-name">{stop.stopName}</span>
                    <span class="stop-distance">{stop.distance} miles</span>
                    <div class="line-preview">{routes}</div>
                </div>
            </li>
        });
        //<input
        //    type="text"
        //    placeholder="Search"
        //></input>
        return (
            <div class="stops">
                <ul>{stopItems}</ul>
            </div>
        );
    }
}
