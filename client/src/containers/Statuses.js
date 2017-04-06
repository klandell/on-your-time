import React from 'react';
import { connect } from 'react-redux';
import { loadStatuses, leaveStatusesView } from 'Actions/statusesActions';
import StatusesView from 'Components/statuses/StatusesView';

@connect(state => ({
    statuses: state.statuses,
}), dispatch => ({
    actions: {
        loadStatuses,
        leaveStatusesView,
    },
    dispatch,
}))
export default class Statuses extends React.Component {
    componentWillMount() {
        const { actions, dispatch } = this.props;
        dispatch(actions.loadStatuses());
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        const { actions, dispatch } = this.props;
        dispatch(actions.leaveStatusesView());
    }

    render() {
        const statuses = this.props.statuses.statuses;
        return (
            <StatusesView
                statuses={statuses}/>
        );
    }
}
