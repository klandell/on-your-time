import React, { PropTypes } from 'react';
import StatusItem from 'Components/statuses/StatusItem';
require('Sass/components/statuses/StatusesList.scss');

export default class DeparturesList extends React.Component {
    static propTypes = {
        statuses: PropTypes.array.isRequired,
    }

    mapStatusItems() {
        return this.props.statuses.map(status => this.renderStatusItem(status));
    }

    renderStatusItem({ name, status }) {
        return (
            <StatusItem
                key={name}
                name={name}
                status={status}/>
        );
    }

    render() {
        const statusItems = this.mapStatusItems();
        return <ul className="statuses-list">{statusItems}</ul>;
    }
}
