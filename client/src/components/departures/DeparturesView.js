import React, { PropTypes } from 'react';
import DeparturesList from 'Components/departures/DeparturesList';

export default class DeparturesView extends React.Component {
    static propTypes = {
        departures: PropTypes.array.isRequired,
        stopName: PropTypes.string.isRequired,
        onToggleClick: PropTypes.func.isRequired,
        direction: PropTypes.number.isRequired,
    }

    renderDirectionToggle() {
        const uptownBtn = this.renderToggleBtn(1);
        const downtownBtn = this.renderToggleBtn(3);

        return (
            <div class="direction-toggle">
                {uptownBtn}
                {downtownBtn}
            </div>
        );
    }

    renderToggleBtn(btnDirection) {
        const btnCls = this.getToggleBtnCls(btnDirection);
        const btnText = this.getToggleBtnText(btnDirection);

        return (
            <div class={btnCls}
                data-direction={btnDirection}
                onClick={e => this.props.onToggleClick(e, btnDirection)}>
                <a>{btnText}</a>
            </div>
        );
    }

    getToggleBtnCls(btnDirection) {
        const direction = this.props.direction;
        return `toggle-btn ${direction === btnDirection ? 'selected-toggle' : null}`;
    }

    getToggleBtnText(btnDirection) {
        return btnDirection === 1 ? 'Uptown' : 'Downtown';
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
