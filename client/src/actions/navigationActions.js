const C = require('Constants');

export function doNavigation(targetView, configs) {
    return {
        type: C.SET_CURRENT_CONTENT,
        targetView,
        configs,
    };
}


export function saveScroll(scrollY) {
    return {
        type: C.SAVE_SCROLL,
        scrollY,
    };
}
