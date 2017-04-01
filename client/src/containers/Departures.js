import React from 'react';
import { connect } from 'react-redux';
import paintSelection from 'paint-selection';
import { loadDepartures, leaveDeparturesView } from 'Actions/departuresActions';
import DeparturesView from 'Components/departures/DeparturesView';

@connect(state => ({
    configs: state.currentContent.configs,
    departures: state.departures,
}), dispatch => ({
    actions: {
        loadDepartures,
        leaveDeparturesView,
    },
    dispatch,
}))
export default class Departures extends React.Component {
    componentWillMount() {
        this.changeDirection(null, 1);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        const { actions, dispatch } = this.props;
        dispatch(actions.leaveDeparturesView());
    }

    onToggleClick(e, direction) {
        paintSelection(e, {
            color: direction === 1 ? '#A239CA' : '#4717F6',
        });
        this.changeDirection(e, direction);
    }

    changeDirection(e, direction) {
        const { actions, configs, departures, dispatch } = this.props;

        if (direction !== departures.direction) {
            dispatch(actions.loadDepartures(configs.stopId, direction));
        }
    }

    render() {
        const props = this.props;
        const departures = props.departures;

        return (
            <DeparturesView
                departures={departures.departures}
                direction={departures.direction || 1}
                stopName={props.configs.stopName}
                onToggleClick={(e, direction) => this.onToggleClick(e, direction)} />
        );
    }
}
