// The entrance of the gallery component
import { renderArray } from './template.js';
import { loadImage } from './async.js';

/**
 * controller for the gallery page
 *
 * @param {HTMLElement} root
 * @param {Resource} postcards
*/
function gallery(root, postcards) {
    const container = root.querySelector('.page');

    const cardElements = postcards.get()
        .then(data => {
            const cards = renderArray(data, container.querySelector('[data-template]'));
            return cards;
        })
        .catch(e => {
            // TODO promote to notice
            console.error(e);
        });

    // dom IO
    cardElements
        .then(cards => {
            cards.forEach(element => {
                element.classList.add('loading');
                container.appendChild(element);
            });

            return loadImage(container, cards);
        })
        .then(cards => {
            // show
            cards.forEach(element => {
                element.classList.remove('loading');
            });
        });
}

export default gallery;
