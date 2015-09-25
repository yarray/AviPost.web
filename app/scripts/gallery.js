// The entrance of the gallery component
// import { renderArray } from './template.js';
import { loadImage } from './async.js';
import snabbdom from 'snabbdom';
import h from 'snabbdom/h';

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

    const view = (cards, loading) => {
        const image = card => {
            return h('li', { 'class': { loading } }, [
                h('figure', [
                    h('img', { props: { src: card.cover } }),
                ]),
            ]);
        };

        return h('ul.page', cards.map(image));
    };

    postcards.get()
        .then(cards => {
            const vnode = patch(root, view(cards, true));
            return loadImage(root, { cards, vnode });
        })
        .then(data => {
            patch(data.vnode, view(data.cards, false));
        })
        .catch(e => {
            // TODO promote to notice
            console.error(e);
            throw e;
        });
}


export default gallery;
