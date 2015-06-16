/* @flow */
// abstraction of ui for the app, only one instance. A function with this object means
// it has side effect on ui
var ui = null;

var visible = function(dom) {
    return dom.style.display === '';
};

var toggle = function(dom) {
    if (visible(dom)) {
        show(dom);
    } else {
        hide(dom);
    }
};

var hide = function(dom) {
    dom.style.display = 'none';
};

var show = function(dom) {
    dom.style.display = '';
};

var getUI = function() /*: Object */ {
    if (ui === null) {
        ui = {
            visible,
            hide,
            show,
            toggle
        };
    }

    return ui;
};

module.exports = getUI;
