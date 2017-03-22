import React, { PropTypes } from 'react';
import DepartureItem from 'Components/departures/DepartureItem';

export default class DeparturesList extends React.Component {
    static propTypes = {
        departures: PropTypes.array.isRequired,

        route: PropTypes.string.isRequired,
        minutes: PropTypes.number.isRequired,
        isClose: PropTypes.bool.isRequired,
        isRealtime: PropTypes.bool.isRequired,
        isExpress: PropTypes.bool,
    }

    mapDepartureItems() {
        return this.props.departures.map(departure => this.renderDepartureItem(departure));
    }

    renderDepartureItem(departure) {
        const key = `${departure.train}-${direction}-${departure.departureTime || departure.arrivalTime}`;
        const now = new Date();
        const departureTime = new Date(departure.departureTime || departure.arrivalTime);
        const minutes = Math.round((departureTime - now) / 1000 / 60);

        let isExpress;
        let train = departure.train;

        if (train.slice(-1) === 'X') {
            train = train.charAt(0);
            isExpress = true;
        } else if (train === 'GS') {
            train = 'S';
        }

        return (
            minutes >= 0 ? <DepartureItem
                key={key}
                route={train}
                minutes={minutes}
                isExpress={isExpress}
                isClose={minutes < 6}
                isRealtime={departure.isRealtime} />
            : null
        );
    }

    render() {
        const departureItems = this.mapDepartureItems();
        return <ul>{departureItems}</ul>;
    }
}
