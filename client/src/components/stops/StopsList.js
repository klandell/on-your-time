import React, { PropTypes } from 'react';
import StopItem from 'Components/stops/StopItem';
require('Sass/components/stops/StopsList.scss');

export default class StopsList extends React.Component {
    static propTypes = {
        stops: PropTypes.array.isRequired,
        loadCount: PropTypes.number.isRequired,
        onStopItemClick: PropTypes.func.isRequired,
        onMoreClick: PropTypes.func.isRequired,
    }

    mapStopItems() {
        const props = this.props;
        const stopItems = props.stops.map(stop => this.renderStopItem(stop));

        if (stopItems.length > 1 && props.loadCount === 10) {
            stopItems.push(this.renderMoreIcon());
        }
        return stopItems;
    }

    renderStopItem(stop) {
        const stopId = stop.stopId;
        const stopDistance = Math.round(stop.distance * 0.000621371 * 10) / 10;

        return (
            <StopItem
                key={stopId}
                stopId={stopId}
                stopName={stop.stopName}
                stopDistance={stopDistance}
                routes={stop.routes}
                clickFn={this.props.onStopItemClick} />
        );
    }

    renderMoreIcon() {
        return (
            <li
                onClick={this.props.onMoreClick}
                key="more-icon"
                className="stop-item more-icon">
                <a>
                    <i className="icon ion-ios-more"></i>
                    <div>more</div>
                </a>
            </li>
        );
    }

    render() {
        const stopItems = this.mapStopItems();
        return <ul className="stops-list">{stopItems}</ul>;
    }
}
