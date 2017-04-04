import React, { PropTypes } from 'react';
import RoutePreview from 'Components/stops/RoutePreview';
require('Sass/components/stops/StopItem.scss');

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
        const hasRoutes = props.routes.length;

        return (
            hasRoutes ?
            <li data-stopid={stopId}
                onClick={props.clickFn}
                className="stop-item">
                <a>
                    <span className="stop-name">{props.stopName}</span>
                    <span className="stop-distance">{`${props.stopDistance} miles`}</span>
                    <RoutePreview
                        routes={props.routes}
                        stopId={stopId}/>
                </a>
            </li>
            : null
        );
    }
}
