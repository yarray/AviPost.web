/* @flow */
// subpage controller in single page applications
var subpages = function(
    specs /*: [{key: string, dom: HTMLElement, init: function}] */
) /*: { [key: string]: function } */ {
    var loader = function(dom, f) {
        var called = false;
        
        return function() {
            specs.forEach(function(spec) {
                spec.dom.classList.add('hide');
            });

            dom.classList.remove('hide');
            if (!called) {
                called = true;
                f(dom);
            }
        };
    };

    specs.forEach(function(spec) {
        spec.dom.classList.add('hide');
    });

    var result = new Map();
    specs.forEach(function(spec) {
        result.set(spec.key, loader(spec.dom, spec.init));
    });
    
    return result;
};

module.exports = subpages;
