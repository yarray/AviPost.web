/* @flow */
// subpage controller in single page applications
var subpages = function(
    specs /*: [{key: string, dom: HTMLElement, init: function}] */ ,
    ui /*: Object */
) /*: { [key: string]: function } */ {
    var load = function(dom, f) {
        var called = false;
        
        return function() {
            specs.forEach(function(spec) {
                ui.hide(spec.dom);
            });
            ui.show(dom);
            if (!called) {
                called = true;
                f.apply(null, arguments);
            }
        };
    };

    specs.forEach(function(spec) {
        ui.hide(spec.dom);
    });

    var result = new Map(
        specs.map(function(spec) {
            return [spec.key, load(spec.dom, spec.init)];
        })
    );
    
    return result;
};

module.exports = subpages;
