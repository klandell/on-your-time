import React, { PropTypes } from 'react';
import RoutePreview from 'Components/stops/RoutePreview';

export default class StopItem extends React.Component {
    static propTypes = {
        stopId: PropTypes.string.isRequired,
        stopName: PropTypes.string.isRequired,
        stopDistance: PropTypes.number.isRequired,
        routes: PropTypes.array.isRequired,
        clickFn: PropTypes.func.isRequired,
    }

    render() {
        const props = this.props;
        const stopId = props.stopId;
        const distance = Math.round(props.stopDistance * 0.000621371 * 10) / 10;

        return (
            <li data-stopid={stopId}
                onClick={e => props.clickFn(e)}
                class="stop-item">
                <a>
                    <span class="stop-name">{props.stopName}</span>
                    <span class="stop-distance">{`${distance} miles`}</span>
                    <RoutePreview
                        routes={props.routes}
                        stopId={stopId}/>
                </a>
            </li>
        );
    }
}
