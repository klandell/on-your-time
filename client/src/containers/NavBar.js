import React from 'react';
import { connect } from 'react-redux';
import doNavigation from 'Actions/navigationActions';
require('Sass/containers/NavBar.scss');

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
                    ? <i class="icon ion-android-arrow-back" onClick={e => this.onBackClick(e)}></i>
                    : null
                }
                <div class="title">On Your Time</div>
            </nav>
        );
    }
}
