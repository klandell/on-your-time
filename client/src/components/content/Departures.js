import React from 'react';
import { connect } from 'react-redux';
import loadDepartures from 'Actions/departuresActions';
require('Sass/content/Departures.scss');

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

            let minutes = Math.round((departureTime - now) / 1000 / 60);
            if (minutes < 0) {
                minutes = 0;
            }

            return <li key={key}>
                <div class="line-preview">
                    <div class={`line-${departure.train}`}>{departure.train}</div>
                    <div class="departure-time" >{`${minutes} minutes`}</div>
                </div>
            </li>
        });
        return (
            <div class="departures">
                <div class="direction-toggle">
                    <div class="toggle-btn selected-toggle" data-direction="1" onClick={e => this.changeDirection(e, 1)}>Uptown</div>
                    <div class="toggle-btn"  data-direction="3" onClick={e => this.changeDirection(e, 3)}>Downtown</div>
                </div>
                <ul>{departureItems}</ul>
            </div>
        );
    }
}
