const C = require('Constants');

export default function doNavigation(targetView, configs) {
    return {
        type: C.SET_CURRENT_CONTENT,
        targetView,
        configs,
    };
}
