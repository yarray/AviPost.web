/* @flow */
// subpage controller in single page applications
function subpages (
    specs /*: [{key: string, dom: HTMLElement, init: function}] */
) /*: { [key: string]: function } */ {
    function loader(dom, f) {
        let called = false;
        
        return () => {
            specs.forEach(spec => {
                spec.dom.classList.add('hide');
            });

            dom.classList.remove('hide');
            if (!called) {
                called = true;
                f(dom);
            }
        };
    }

    specs.forEach(spec => {
        spec.dom.classList.add('hide');
    });

    const result = new Map();
    specs.forEach(spec => {
        result.set(spec.key, loader(spec.dom, spec.init));
    });
    
    return result;
}

export default subpages;
