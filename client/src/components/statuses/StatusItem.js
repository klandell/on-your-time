import React, { PropTypes } from 'react';
require('Sass/components/statuses/StatusItem.scss');

export default class StatusList extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    }

    renderRoutes() {
        const name = this.props.name;
        const routes = name === 'SIR' ? [name] : name.split('');
        return routes.map(route => <div key={route} className={`line line-${route}`}>{route}</div>);
    }

    getStatus() {
        const status = this.props.status;
        return status.charAt(0).toUpperCase() + status.substr(1).toLowerCase();
    }

    renderStatus() {
        const status = this.getStatus();
        return <div className={`status ${status.toLowerCase().replace(' ', '-')}`}>{status}</div>;
    }

    render() {
        const status = this.renderStatus();
        const routes = this.renderRoutes();

        return (
            <li className="status-item">
                <div className="status-preview">
                    <div className="route-preview">{routes}</div>
                    {status}
                </div>
            </li>
        );
    }
}
