import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

let middleware = [thunk];

// Apply any dev only middleware
if (process.env.NODE_ENV !== 'production') {
    const logger = require('redux-logger');
    middleware = [...middleware, logger()];
}

// Export our global redux store
export default createStore(reducer, applyMiddleware(...middleware));
