import React from 'react';
import { connect } from 'react-redux';
import loadDepartures from 'Actions/departuresActions';

@connect(state => {
    return {
        configs: state.currentContent.configs,
        departures: state.departures
    };
}, dispatch => {
    return {
        actions: {
            loadDepartures
        },
        dispatch
    };
})
export default class Departures extends React.Component {
    componentWillMount() {
        this.changeDirection(null, 1);
    }

    handleButtonKeyPress

    changeDirection(e, direction) {
        const {actions, configs, dispatch} = this.props;
        dispatch(actions.loadDepartures(configs.stopId, direction));
    }

    render() {
        const direction = this.props.departures.direction;
        const departures = this.props.departures.departures;
        const departureItems = departures.map(departure => {
            const key = `${departure.train}-${direction}-${departure.departureTime || departure.arrivalTime}`
            return <li key={key}>{key}</li>
        });
        return (
            // TODO: aria stuff
            <div class="departures">
                <div class="selected-direction" onClick={e => this.changeDirection(e, 1)}>Uptown</div>
                <div onClick={e => this.changeDirection(e, 3)}>Downtown</div>
                <ul>{departureItems}</ul>
            </div>
        );
    }
}
