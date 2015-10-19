// The entrance of the gallery component
const snabbdom = require('snabbdom');
const h = require('snabbdom/h');
const c = require('ramda').compose;

const flyd = require('./flyd.js');


const patch = snabbdom.init([
    require('snabbdom/modules/props'),
    require('snabbdom/modules/class'),
    require('./behavior.js'),
    require('./masonry.js'),
]);

const image = card => (
    h('li', {
        behavior: { hideTillImagesLoaded: {} },
    }, [
        h('figure', [
            h('img', { props: { src: card.cover } }),
            h('figcaption', card.message),
        ]),
    ])
);

const view = cards => (
    h('ul.page', {
        masonry: {},
    }, cards.map(image))
);

/**
 * controller for the gallery page
 *
 * @param {HTMLElement} root
 * @param {Resource} postcards
 * @param {Stream} activated
 */
const gallery = (root, postcards, toggle) => {
    const refresh = params => {
        return params ? flyd.innerEvery(3000, params) : flyd.stream();
    };

    const process = c(
            flyd.scan(patch, root),
            flyd.map(view), flyd.map(postcards.get),
            flyd.switchLatest,
            flyd.map(refresh)
            );

    return process(toggle);
};


module.exports = gallery;
