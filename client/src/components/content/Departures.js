import React from 'react';
import { connect } from 'react-redux';
import {loadDepartures, leaveDeparturesView} from 'Actions/departuresActions';
require('Sass/content/Departures.scss');

@connect(state => {
    return {
        configs: state.currentContent.configs,
        departures: state.departures
    };
}, dispatch => {
    return {
        actions: {
            loadDepartures,
            leaveDeparturesView
        },
        dispatch
    };
})
export default class Departures extends React.Component {
    componentWillMount() {
        this.changeDirection(null, 1);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        const {actions, dispatch} = this.props;
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
        ink.style.top = `${e.pageY - currentTarget.offsetTop - max / 2}px`;
        ink.style.left = `${e.pageX - currentTarget.offsetLeft - max / 2}px`;
        ink.classList.add('animate');

        setTimeout(() => ink.classList.remove('animate'), 650);
    }

    changeDirection(e, direction) {
        const {actions, configs, dispatch} = this.props;
        let doLoad;

        if (e) {
            const currentTarget = e.currentTarget;

            if (!currentTarget.classList.contains('selected-toggle')) {
                currentTarget.classList.add('selected-toggle');

                const sel = `.toggle-btn:not([data-direction="${currentTarget.getAttribute('data-direction')}"])`;
                const oldDirection = currentTarget.parentNode.querySelector(sel);
                oldDirection.classList.remove('selected-toggle');
                doLoad = true;
            }
        }

        if (!e || doLoad) {
            dispatch(actions.loadDepartures(configs.stopId, direction));
        }
    }

    render() {
        const direction = this.props.departures.direction;
        const departures = this.props.departures.departures;
        const departureItems = departures.map(departure => {
            const key = `${departure.train}-${direction}-${departure.departureTime || departure.arrivalTime}`;
            const now = new Date();
            const departureTime = new Date(departure.departureTime || departure.arrivalTime);
            const minutes = Math.round((departureTime - now) / 1000 / 60);

            return minutes >= 0 ? <li key={key}>
                <div class="line-preview">
                    <div class={`line-${departure.train}`}>{departure.train}</div>
                    <div class={`departure-time ${minutes < 6 ? 'close-departure' : ''}`}>{`${minutes} minute${minutes === 1 ? '' : 's'}`}</div>
                </div>
            </li> : null;
        });
        return (
            <div class="departures">
                <div class="direction-toggle">
                    <div class="toggle-btn selected-toggle" data-direction="1" onClick={e => this.onToggleClick(e, 1)}><a>Uptown</a></div>
                    <div class="toggle-btn"  data-direction="3" onClick={e => this.onToggleClick(e, 3)}><a>Downtown</a></div>
                </div>
                <ul>{departureItems}</ul>
            </div>
        );
    }
}
