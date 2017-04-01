import React, { PropTypes } from 'react';
import ToggleButton from 'Components/departures/direction/ToggleButton';
require('Sass/components/departures/direction/DirectionToggle.scss');

export default class DirectionToggle extends React.Component {
    static propTypes = {
        onToggleClick: PropTypes.func.isRequired,
        direction: PropTypes.number.isRequired,
    }

    renderToggleBtn(btnDirection) {
        const props = this.props;

        return (
            <ToggleButton
                direction={props.direction}
                btnDirection={btnDirection}
                onToggleClick={props.onToggleClick} />
        );
    }

    render() {
        const uptownBtn = this.renderToggleBtn(1);
        const downtownBtn = this.renderToggleBtn(3);

        return (
            <div className="direction-toggle">
                {uptownBtn}
                {downtownBtn}
            </div>
        );
    }
}
