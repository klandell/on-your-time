import React, { PropTypes } from 'react';
import StatusesList from 'Components/statuses/StatusesList';
require('Sass/components/statuses/StatusesView.scss');

export default class StatusesView extends React.Component {
    static propTypes = {
        statuses: PropTypes.array.isRequired,
    }

    render() {
        return (
            <div className="statuses">
                <StatusesList
                    statuses={this.props.statuses} />
            </div>
        );
    }
}
