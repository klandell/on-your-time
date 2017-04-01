import React from 'react';
import { connect } from 'react-redux';
import doNavigation from 'Actions/navigationActions';
require('Sass/containers/NavBar.scss');

@connect(state => ({
    view: state.currentContent.view,
}), dispatch => ({
    actions: {
        doNavigation,
    },
    dispatch,
}))
export default class NavBar extends React.Component {
    onBackClick() {
        const { actions, dispatch } = this.props;
        dispatch(actions.doNavigation('stops'));
    }

    renderBackBtn() {
        return (this.props.view !== 'stops' ?
            <i className="icon ion-android-arrow-back" onClick={e => this.onBackClick(e)}></i>
            : null
        );
    }

    render() {
        const backBtn = this.renderBackBtn();
        return (
            <nav>
                {backBtn}
                <div className="title">On Your Time</div>
            </nav>
        );
    }
}
