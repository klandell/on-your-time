const C = require('Constants');

export default function reducer(state = {
    view: 'stops',
    scrollY: 0,
    configs: {},
}, action) {
    switch (action.type) {
    case C.SET_CURRENT_CONTENT:
        return Object.assign({}, state, {
            view: action.targetView,
            configs: action.configs || {},
        });
    case C.SAVE_SCROLL:
        return Object.assign({}, state, {
            scrollY: action.scrollY,
        });
    default:
        return state;
    }
}
