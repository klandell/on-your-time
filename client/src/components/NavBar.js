import React from 'react';
import { connect } from 'react-redux';
import doNavigation from 'Actions/navigationActions';
require('Sass/NavBar.scss');

@connect(state => {
    return {
        view: state.currentContent.view
    }
}, dispatch => {
    return {
        actions: {
            doNavigation
        },
        dispatch
    };
})
export default class NavBar extends React.Component {

    onBackClick(e) {
        const {actions, dispatch} = this.props;
        dispatch(actions.doNavigation('stops'));
    }

    render() {
        return (
            <nav>
                {
                    this.props.view !== 'stops'
                    ? <div class="back-arrow" onClick={e => this.onBackClick(e)}>Back</div>
                    : null
                }
                <div class="title">On Your Time</div>
            </nav>
        );
    }
}
