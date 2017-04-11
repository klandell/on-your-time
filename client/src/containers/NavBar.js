import React from 'react';
import { connect } from 'react-redux';
import { doNavigation, saveScroll } from 'Actions/navigationActions';
import zenscroll from 'zenscroll';

require('Sass/containers/NavBar.scss');

@connect(state => ({
    view: state.currentContent.view,
}), dispatch => ({
    actions: {
        doNavigation,
        saveScroll,
    },
    dispatch,
}))
export default class NavBar extends React.Component {
    onBackClick() {
        const { actions, dispatch } = this.props;
        dispatch(actions.doNavigation('stops'));
    }

    renderBackBtn() {
        return this.props.view !== 'stops' ? (
            <div className="nav-icon" onClick={e => this.onBackClick(e)}>
            <i className="icon ion-android-arrow-back"></i>
            </div>
        ) : null;
    }

    onNavIconClick() {
        const { actions, dispatch } = this.props;
        this.saveScroll();
        dispatch(actions.doNavigation('statuses'));
    }

    renderNavIcon() {
        const iconCls = this.getNavIconCls();
        return iconCls ? (
            <div className="nav-icon icon-right" onClick={e => this.onNavIconClick(e)}>
                <i className={iconCls}></i>
            </div>
        ) : null;
    }

    getNavIconCls() {
        const view = this.props.view;
        return view === 'stops' ? 'ion-information-circled' : null;
    }

    onTitleClick() {
        zenscroll.toY(0);
    }

    saveScroll() {
        const { actions, dispatch } = this.props;
        const doc = document.documentElement;
        const scrollY = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        dispatch(actions.saveScroll(scrollY));
    }

    render() {
        const backBtn = this.renderBackBtn();
        const navIcon = this.renderNavIcon();
        return (
            <nav>
                {backBtn}
                <div onClick={e => this.onTitleClick(e)} className="title">On Your Time</div>
                {navIcon}
            </nav>
        );
    }
}
