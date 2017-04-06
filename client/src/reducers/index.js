import { combineReducers } from 'redux';
import currentContent from 'Reducers/navigationReducer';
import stops from 'Reducers/stopsReducer';
import departures from 'Reducers/departuresReducer';
import statuses from 'Reducers/statusesReducer';

export default combineReducers({
    currentContent,
    stops,
    departures,
    statuses,
});
