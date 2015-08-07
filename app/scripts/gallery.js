/* @flow */

// The entrance of the gallery component
import ajax from './ajax.js';
import { renderArray } from './template.js';
import { removeNulls } from './helper.js';
import { loadImage } from './async.js';


// cannot declare as UI, because flow requires an interface file to handle
// it, but it restart server every time and is super slow.
function gallery(
    root /*: Element */,
    uri /*: string */
) {
    const container = root.querySelector('.page');

    const request = new XMLHttpRequest();
    request.open('GET', uri + '/postcards/');
    request.setRequestHeader("Accept", "application/json");

    const cardElements /* : Promise<[Element]> */ = (
        ajax.promise(request)
        .catch(res => {
            console.error(res.statusText);
        })
        .then(res => {
            const data = JSON.parse(res.responseText);
            const cards = renderArray(data, container.querySelector('[data-template]'));
            return removeNulls(cards);
        })
    );

    // dom IO
    cardElements.then(cards => {
            cards.forEach(element => {
                element.classList.add('hide');
                container.appendChild(element);
            });
            return loadImage(container, cards);
        })
        .then(cards => {
            // show
            cards.forEach(element => {
                element.classList.remove('hide');
            });
        });
}

export default gallery;
