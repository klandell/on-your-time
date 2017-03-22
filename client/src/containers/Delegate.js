import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

// import possible content pages
import Stops from 'Containers/Stops';
import Departures from 'Containers/Departures';

require('Sass/containers/Delegate.scss');

@connect(state => ({
    view: state.currentContent.view,
}))
export default class Delegate extends React.Component {
    static targetTags = {
        stops: <Stops key="stops" />,
        departures: <Departures key="departures" />,
    }

    render() {
        let view = this.props.view;
        const targetTags = this.constructor.targetTags;

        if (!targetTags[view]) {
            view = 'stops';
        }
        return (
            <ReactCSSTransitionGroup
                transitionName="content"
                transitionEnterTimeout={400}
                transitionLeaveTimeout={400}
                class="navigation-delegate">
                {targetTags[view]}
            </ReactCSSTransitionGroup>
        );
    }
}
