// The entrance of the gallery component
import snabbdom from 'snabbdom';
import h from 'snabbdom/h';
import most from 'most';

import { imagesLoaded } from './async.js';

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

    function traceImageLoading(element) {
        element.classList.add('image-loading');
        imagesLoaded(element).then(
            () => element.classList.remove('image-loading')
        );
    }

    function image(card) {
        return (
            h('li', {
                hook: { create: (_, vnode) => traceImageLoading(vnode.elm) },
            }, [
                h('figure', [
                    h('img', { props: { src: card.cover } }),
                ]),
            ]));
    }

    function view(cards) {
        return h('ul.page', cards.map(image));
    }

    // const load = most.periodic(1000, 1);
    const load = most.just(1);
    // TODO what if here is 'post'?
    const cardsLoaded = load.map(postcards.get).await();
    const viewLoad = cardsLoaded.map(view);

    // with side effect
    viewLoad.scan(patch, root).drain();
}


export default gallery;
