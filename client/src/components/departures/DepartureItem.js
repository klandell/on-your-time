import React, { PropTypes } from 'react';

export default class DepartureItem extends React.Component {
    static propTypes = {
        route: PropTypes.string.isRequired,
        minutes: PropTypes.number.isRequired,
        isClose: PropTypes.bool.isRequired,
        isRealtime: PropTypes.bool.isRequired,
        isExpress: PropTypes.bool,
    }

    render() {
        const props = this.props;
        const route = props.route;
        const minutes = props.minutes;

        return (
            <li>
                <div class="route-preview">
                    <div class={`line-${route}`}>{route}</div>
                    {props.isExpress ? <div class="express-indicator">Express</div> : null}
                    <div class={`departure-time ${props.isClose} ? 'close-departure' : ''`}>
                        {`${minutes} minute${minutes === 1 ? '' : 's'}`}
                        {props.isRealtime ? <i class="icon ion-social-rss"></i> : null}
                    </div>
                </div>
            </li>
        );
    }
}
