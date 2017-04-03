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
        const lineCls = `line line-${route}`;
        const expressInd = this.renderExpress();
        const departureTimeCls = this.getDepartureTimeCls();
        const minutes = this.renderMinutes();
        const realtime = this.renderRealtime();

        return (
            <div className="route-preview">
                <div className={lineCls}>{route}</div>
                {expressInd}
                <div className={departureTimeCls}>
                    {minutes}
                    {realtime}
                </div>
            </div>
        );
    }

    renderExpress() {
        return this.props.isExpress ? <div className="express-indicator">Express</div> : null;
    }

    getDepartureTimeCls() {
        return `departure-time ${this.props.isClose ? 'close-departure' : ''}`;
    }

    renderMinutes() {
        const minutes = this.props.minutes;
        return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }

    renderRealtime() {
        return this.props.isRealtime ? <i className="icon ion-social-rss"></i> : null;
    }

    render() {
        const preview = this.renderPreview();
        return <li className="departure-item">{preview}</li>;
    }
}
