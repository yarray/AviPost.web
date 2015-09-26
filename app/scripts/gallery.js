// The entrance of the gallery component
import snabbdom from 'snabbdom';
import h from 'snabbdom/h';
import most from 'most';

import { loadImage } from './async.js';

/**
 * controller for the gallery page
 *
 * @param {HTMLElement} root
 * @param {Resource} postcards
 */
function gallery(root, postcards) {
    const patch = snabbdom.init([
        require('snabbdom/modules/props'),
        require('snabbdom/modules/class'),
    ]);

    function image(card) {
        return h('li', [
            h('figure', [
                h('img', { props: { src: card.cover } }),
            ]),
        ]);
    }

    function view(cards, loaded) {
        return h('ul.page', { 'class': { loading: !loaded } }, cards.map(image));
        // return h('ul.page', cards.map(image));
    }

    const load = most.periodic(1000, 1);
    // const load = most.just(1);
    const cardsLoaded = load.map(postcards.get).await();
    const viewLoad = cardsLoaded.map(view);
    const imagesLoaded = cardsLoaded.map(() => loadImage(root)).await();
    const viewLoaded = most.zip(view, cardsLoaded, imagesLoaded);
    const viewUpdate = most.merge(viewLoad, viewLoaded);

    // with side effect
    // viewLoad.scan(patch, root).drain();
    viewUpdate.scan(patch, root).drain();
}


export default gallery;
