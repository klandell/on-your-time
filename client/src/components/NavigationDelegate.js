import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';

// import possible content pages
import Stops from 'Components/content/Stops';
import Departures from 'Components/content/Departures';

require('Sass/NavigationDelegate.scss');

@connect(state => {
    return {
        view: state.currentContent.view
    }
})
export default class ContentContainer extends React.Component {
    static targetTags = {
        stops: <Stops key="stops" />,
        departures: <Departures key="departures" />
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
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
                class="navigation-delegate">
                {targetTags[view]}
            </ReactCSSTransitionGroup>
        );
    }
}
