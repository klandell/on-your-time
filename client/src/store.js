import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducers';

const middleware = applyMiddleware(thunk, logger());

// Export our global redux store
export  default createStore(reducer, middleware);
