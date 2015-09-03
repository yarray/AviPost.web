// The entrance of the gallery component
import ajax from './ajax.js';
import { renderArray } from './template.js';
import { loadImage } from './async.js';

/**
 * controller for the gallery page
 *
 * @param {HTMLElement} root
 * @param {string} uri
*/
function gallery(root, uri) {
    const container = root.querySelector('.page');

    const request = new XMLHttpRequest();
    request.open('GET', uri + '/postcards/');
    request.setRequestHeader('Accept', 'application/json');

    const cardElements = ajax.promise(request)
        .catch(res => {
            // TODO promote to notice
            console.error(res.statusText);
        })
        .then(res => {
            const data = JSON.parse(res.responseText);
            const cards = renderArray(data, container.querySelector('[data-template]'));
            return cards;
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
