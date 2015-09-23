// subpage controller in single page applications
/**
 * select
 *
 * @param {Object.<string, bool>} state
 * @param {string} target
 * @return {Object.<string, bool>}
 */
function select(state, target) {
    const a = state[tarrget];
}

/**
 * subpages
 *
 * @param {{key: string, dom: HTMLElement, init: function}[]} specs
 * @return {{Map.<string, function>}[]}
 */
function subpages(specs) {
    /**
     * loader
     *
     * @param {HTMLElement} dom
     * @param {function} init
     * @return {function}
     */
    function loader(dom, init) {
        let inited = false;

        return () => {
            specs.forEach(spec => {
                spec.dom.style.display = 'none';
            });

            // restore display
            dom.style.display = null;
            if (!inited) {
                inited = true;
                init(dom);
            }
        };
    }

    specs.forEach(spec => {
        spec.dom.style.visibility = 'none';
    });

    const result = new Map();
    specs.forEach(spec => {
        result.set(spec.key, loader(spec.dom, spec.init));
    });

    return result;
}

export default subpages;
