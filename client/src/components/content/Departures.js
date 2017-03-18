import React from 'react';
import { connect } from 'react-redux';
import loadDepartures from 'Actions/departuresActions';

@connect(state => {
    return {
        configs: state.currentContent.configs,
        departures: state.departures.departures
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
        const {actions, configs, dispatch} = this.props;
        dispatch(actions.loadDepartures(configs.stopId, 1));
    }

    render() {
        const departures = this.props.departures;
        const departureItems = departures.map(departure => {
            const key = `${departure.train}-${departure.departureTime || departure.arrivalTime}`
            return <li key={key}>{key}</li>
        });
        return (
            <ul class="departures">{departureItems}</ul>
        );
    }
}
