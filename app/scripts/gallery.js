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
 * @param {Stream} activated
 */
function gallery(root, postcards, on, off) {
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

    const input = on.map(data => {
        return most.periodic(1000, data).until(off);
    }).join();
    // TODO what if here is 'post'?
    const cardsLoaded = input.map(postcards.get).await();
    const viewLoad = cardsLoaded.map(view);

    // with side effect
    return viewLoad.scan(patch, root);
}


export default gallery;
