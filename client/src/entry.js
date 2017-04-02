import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import Layout from 'Containers/Layout';
import store from './store';

OfflinePluginRuntime.install({
    onUpdateReady() {
        OfflinePluginRuntime.applyUpdate();
    },
    onUpdated() {
        window.location.reload();
    },
});

const app = document.getElementById('app');
ReactDOM.render(
    <Provider store={store}>
        <Layout/>
    </Provider>, app,
);
