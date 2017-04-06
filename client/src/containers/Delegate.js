import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

// import possible content pages
import Stops from 'Containers/Stops';
import Departures from 'Containers/Departures';
import Statuses from 'Containers/Statuses';

require('Sass/containers/Delegate.scss');

@connect(state => ({
    view: state.currentContent.view,
}))
export default class Delegate extends React.Component {
    static targetTags = {
        stops: <Stops key="stops" />,
        departures: <Departures key="departures" />,
        statuses: <Statuses key="statuses" />,
    }

    renderTarget() {
        const targetTags = this.constructor.targetTags;
        let view = this.props.view;

        if (!targetTags[view]) {
            view = 'stops';
        }
        return targetTags[view];
    }

    render() {
        const target = this.renderTarget();
        return (
            <ReactCSSTransitionGroup
                transitionName="content"
                transitionEnterTimeout={400}
                transitionLeaveTimeout={400}
                className="navigation-delegate">
                {target}
            </ReactCSSTransitionGroup>
        );
    }
}
