import React from 'react';
import { connect } from 'react-redux';
import { loadDepartures, leaveDeparturesView } from 'Actions/departuresActions';
import DeparturesView from 'Components/departures/DeparturesView';
require('Sass/containers/Departures.scss');

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
        this.paintSelection(e);
        this.changeDirection(e, direction);
    }

    // TODO: make util library for stuff like this?
    paintSelection(e) {
        const currentTarget = e.currentTarget;
        const max = Math.max(currentTarget.clientWidth, currentTarget.clientHeight);
        let ink = currentTarget.querySelector('.ink');

        if (!ink) {
            ink = document.createElement('span');
            ink.style.height = `${max}px`;
            ink.style.width = `${max}px`;
            ink.classList.add('ink');
            currentTarget.insertBefore(ink, currentTarget.firstChild);
        }

        ink.classList.remove('animate');
        ink.style.top = `${e.pageY - currentTarget.offsetTop - (max / 2)}px`;
        ink.style.left = `${e.pageX - currentTarget.offsetLeft - (max / 2)}px`;
        ink.classList.add('animate');

        setTimeout(() => ink.classList.remove('animate'), 650);
    }

    changeDirection(e, direction) {
        const { actions, configs, dispatch } = this.props;

        // TODO: only reload if state direction is different
        dispatch(actions.loadDepartures(configs.stopId, direction));
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
