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

export default nav;
