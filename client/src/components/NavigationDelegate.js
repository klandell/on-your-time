import React from 'react';
import {connect} from 'react-redux';

// import possible content pages
import Stops from 'Components/content/Stops';
import Departures from 'Components/content/Departures';

@connect(state => state)
export default class ContentContainer extends React.Component {
    static targetTags = {
        stops: <Stops />,
        departures: <Departures />
    }

    render() {
        let view = this.props.currentContent.view;
        const targetTags = this.constructor.targetTags;

        if (!targetTags[view]) {
            view = 'stops';
        }
        return targetTags[view];
    }
}
