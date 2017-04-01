import React, { PropTypes } from 'react';
import DepartureItem from 'Components/departures/DepartureItem';
require('Sass/components/departures/DeparturesList.scss');

export default class DeparturesList extends React.Component {
    static propTypes = {
        departures: PropTypes.array.isRequired,
        direction: PropTypes.number.isRequired,
    }

    mapDepartureItems() {
        return this.props.departures.map(departure => this.renderDepartureItem(departure));
    }

    renderDepartureItem(departure) {
        const route = this.getRoute(departure.train);
        const key = this.getItemKey(departure);
        const departureTime = new Date(departure.departureTime || departure.arrivalTime);
        const minutes = Math.round((departureTime - new Date()) / 1000 / 60);

        return (
            minutes >= 0 ? <DepartureItem
                key={key}
                route={route.route}
                minutes={minutes}
                isExpress={route.isExpress}
                isClose={minutes < 6}
                isRealtime={departure.isRealtime} />
            : null
        );
    }

    getItemKey(departure) {
        return `${departure.train}-${this.props.direction}-${departure.departureTime || departure.arrivalTime}`;
    }

    getRoute(rte) {
        let route = rte;
        let isExpress;
        const lastChar = rte.slice(-1);

        if (lastChar === 'X') {
            route = rte.charAt(0);
            isExpress = true;
        } else if (lastChar === 'S') {
            route = 'S';
        } else if (rte === 'SI') {
            route = 'SIR';
        }

        return {
            route,
            isExpress,
        };
    }

    render() {
        const departureItems = this.mapDepartureItems();
        return <ul className="departures-list">{departureItems}</ul>;
    }
}
