import snabbdom from 'snabbdom';
import h from 'snabbdom/h';

/**
 * nav
 *
 * @param {HTMLElement} element
 * @param {string} page
 */
function nav(states) {
    function navItem(name, href, isActive) {
        return (
            h('a', {
                'class': { inactive: !isActive },
                props: {
                    'href': href,
                },
            }, name));
    }

    return h('nav', [
        navItem('Compose', '#/compose', states.compose),
        navItem('Gallery', '#/gallery', states.gallery)]);
}


/**
 * common
 *
 * @param {HTMLElement} navElement
 * @param {Object} pages
 * @param {Stream} routings
 * @return {undefined}
 */
function common(navElement, pages, routings) {
    // hook page show/hide
    routings.observe(states => {
        Object.keys(pages).forEach(
            page => {
                pages[page].style.display = states[page] ? null : 'none';
            }
        );
    });

    const patch = snabbdom.init([
        require('snabbdom/modules/props'),
        require('snabbdom/modules/class'),
    ]);

    routings.map(nav).reduce(patch, navElement);
}

export default common;
