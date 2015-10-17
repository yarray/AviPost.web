// The entrance of the gallery component
import snabbdom from 'snabbdom';
import h from 'snabbdom/h';
import { compose as c } from 'ramda';

const flyd = require('./flyd.js');


/**
 * controller for the gallery page
 *
 * @param {HTMLElement} root
 * @param {Resource} postcards
 * @param {Stream} activated
 */
const gallery = (root, postcards, toggle) => {
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


export default gallery;
