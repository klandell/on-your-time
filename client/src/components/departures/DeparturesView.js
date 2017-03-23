import React, { PropTypes } from 'react';
import DeparturesList from 'Components/departures/DeparturesList';
import DirectionToggle from 'Components/departures/direction/DirectionToggle';

export default class DeparturesView extends React.Component {
    static propTypes = {
        departures: PropTypes.array.isRequired,
        stopName: PropTypes.string.isRequired,
        onToggleClick: PropTypes.func.isRequired,
        direction: PropTypes.number.isRequired,
    }

    renderDirectionToggle() {
        const props = this.props;

        return (
            <DirectionToggle
                onToggleClick={props.onToggleClick}
                direction={props.direction} />
        );
    }

    render() {
        const props = this.props;
        const directionToggle = this.renderDirectionToggle();

        return (
            <div class="departures">
                <div class="stop-name">{props.stopName}</div>
                {directionToggle}
                <DeparturesList
                    departures={props.departures}
                    direction={props.direction} />
            </div>
        );
    }
}
