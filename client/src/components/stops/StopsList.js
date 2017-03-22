import React, { PropTypes } from 'react';
import StopItem from 'Components/stops/StopItem';

export default class StopsList extends React.Component {
    static propTypes = {
        stops: PropTypes.array.isRequired,
        onStopItemClick: PropTypes.func.isRequired,
    }

    render() {
        const props = this.props;
        const stopItems = props.stops.map((stop) => {
            const stopId = stop.stopId;
            return (
                <StopItem
                    key={stopId}
                    stopId={stopId}
                    stopName={stop.stopName}
                    stopDistance={stop.distance}
                    routes={stop.routes}
                    clickFn={e => props.onStopItemClick(e)}/>
            );
        });

        return <ul>{stopItems}</ul>;
    }
}


// if (stopItems.length > 1 && stops.loadCount === 10) {
//    stopItems.push(<li
//        onClick={e => this.loadMoreStops(e)}
//        key="more-icon"
//        class="stop-item more-icon">
//        <a><i class="icon ion-ios-more"></i></a>
//    </li>);
// }
