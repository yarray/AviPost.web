const snabbdom = require('snabbdom');
const flyd = require('flyd');
const h = require('snabbdom/h');


const navItem = (name, href, isActive) => (
    h('a', {
        'class': { inactive: !isActive },
        props: {
            'href': href,
        },
    }, name)
);

const nav = states => (
    h('nav', [
        navItem('Compose', '#/compose', states.compose),
        navItem('Gallery', '#/gallery', states.gallery),
        navItem('Worldmap', '#/worldmap', states.worldmap),
    ])
);


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
    flyd.on(states => {
        Object.keys(pages).forEach(
            page => {
                pages[page].style.display = states[page] ? null : 'none';
            }
        );
    })(routings);

    const patch = snabbdom.init([
        require('snabbdom/modules/props'),
        require('snabbdom/modules/class'),
    ]);

    return flyd.scan(patch, navElement, routings.map(nav));
}

module.exports = common;
