/* @flow */
// subpage controller in single page applications
var subpages = function(
    specs /*: [{key: string, dom: HTMLElement, init: function}] */
) /*: { [key: string]: function } */ {
    var load = function(dom, f) {
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

    var result = new Map(
        specs.map(function(spec) {
            return [spec.key, load(spec.dom, spec.init)];
        })
    );
    
    return result;
};

module.exports = subpages;
