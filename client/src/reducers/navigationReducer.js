const C = require('Constants');

export default function reducer(state = {
    view: 'stops',
    configs: {},
}, action) {
    switch (action.type) {
    case C.SET_CURRENT_CONTENT:
        return Object.assign({}, state, {
            view: action.targetView,
            configs: action.configs || {},
        });
    default:
        return state;
    }
}
