import React, { PropTypes } from 'react';
require('Sass/components/departures/direction/ToggleButton.scss');

export default class ToggleButton extends React.Component {
    static propTypes = {
        btnDirection: PropTypes.number.isRequired,
        onToggleClick: PropTypes.func.isRequired,
        direction: PropTypes.number.isRequired,
    }

    getToggleBtnCls(btnDirection) {
        const direction = this.props.direction;
        return `toggle-btn ${direction === btnDirection ? 'selected-toggle' : null}`;
    }

    getToggleBtnText(btnDirection) {
        return btnDirection === 1 ? 'Uptown and Queens' : 'Downtown and Brooklyn';
    }

    render() {
        const props = this.props;
        const btnDirection = props.btnDirection;
        const btnCls = this.getToggleBtnCls(btnDirection);
        const btnText = this.getToggleBtnText(btnDirection);

        return (
            <div className={btnCls}
                data-direction={btnDirection}
                onClick={e => props.onToggleClick(e, btnDirection)}>
                <a>{btnText}</a>
            </div>
        );
    }
}
