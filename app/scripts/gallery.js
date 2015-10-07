// The entrance of the gallery component
import snabbdom from 'snabbdom';
import h from 'snabbdom/h';
import most from 'most';
import { identity } from 'ramda';


/**
 * controller for the gallery page
 *
 * @param {HTMLElement} root
 * @param {Resource} postcards
 * @param {Stream} activated
 */
function gallery(root, postcards, toggle) {
    const patch = snabbdom.init([
        require('snabbdom/modules/props'),
        require('snabbdom/modules/class'),
        require('./behavior.js'),
        require('./masonry.js'),
    ]);

    function image(card) {
        return (
            h('li', {
                behavior: { hideTillImagesLoaded: {} },
            }, [
                h('figure', [
                    h('img', { props: { src: card.cover } }),
                    h('figcaption', card.message),
                ]),
            ]));
    }

    function view(cards) {
        return h('ul.page', {
            masonry: {},
        }, cards.map(image));
    }

    const input = toggle.filter(identity).map(data => {
        return most.periodic(3000, data).until(toggle.skip(1));
    }).join();
    // TODO what if here is 'post'?
    const cardsLoaded = input.map(postcards.get).await();
    const viewLoad = cardsLoaded.map(view);

    // with side effect
    return viewLoad.reduce(patch, root);
}


export default gallery;
