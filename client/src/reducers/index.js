import { combineReducers } from 'redux';
import currentContent from './navigationReducer';
import stops from './stopsReducer';
import departures from './departuresReducer';

export default combineReducers({
    currentContent,
    stops,
    departures,
});
