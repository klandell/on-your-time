import React, {PropTypes} from 'react';

export default class StopItem extends React.Component {
    static propTypes = {
        stopName: PropTypes.string.isRequired
    }



    render() {
        return (
            <li
                onClick={e => this.loadDepartures(e)}
                key={stop.stopId}
                data-stopid={stop.stopId}
                class="stop-item">
                <a>
                    <span class="stop-name">{stop.stopName}</span>
                    <span class="stop-distance">{Math.round(stop.distance * 0.000621371 * 10) / 10} miles</span>
                    <div class="line-preview">{routes}</div>
                </a>
            </li>
        );
    }
}
