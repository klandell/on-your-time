import React from 'react';
import NavBar from 'Components/NavBar';
import NavigationDelegate from 'Components/NavigationDelegate';
//require('sass/Layout.scss');

export default class Layout extends React.Component {
	render() {
        return (
            <div class="layout-wrapper">
                <NavBar />
                <NavigationDelegate />
            </div>
        );
    }
}
