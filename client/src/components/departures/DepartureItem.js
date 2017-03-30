import React, { PropTypes } from 'react';
require('Sass/components/departures/DepartureItem.scss');

export default class DepartureItem extends React.Component {
    static propTypes = {
        route: PropTypes.string.isRequired,
        minutes: PropTypes.number.isRequired,
        isClose: PropTypes.bool.isRequired,
        isRealtime: PropTypes.bool.isRequired,
        isExpress: PropTypes.bool,
    }

    renderPreview() {
        const route = this.props.route;
        const lineCls = `${`line-${route}`}`;
        const expressInd = this.renderExpress();
        const departureTimeCls = this.getDepartureTimeCls();
        const minutes = this.renderMinutes();
        const realtime = this.renderRealtime();

        return (
            <div class="route-preview">
                <div class={lineCls}>{route}</div>
                {expressInd}
                <div class={departureTimeCls}>
                    {minutes}
                    {realtime}
                </div>
            </div>
        );
    }

    renderExpress() {
        return this.props.isExpress ? <div class="express-indicator">Express</div> : null;
    }

    getDepartureTimeCls() {
        return `departure-time ${this.props.isClose ? 'close-departure' : ''}`;
    }

    renderMinutes() {
        const minutes = this.props.minutes;
        return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }

    renderRealtime() {
        return this.props.isRealtime ? <i class="icon ion-social-rss"></i> : null;
    }

    render() {
        const preview = this.renderPreview();
        return <li class="departure-item">{preview}</li>;
    }
}
