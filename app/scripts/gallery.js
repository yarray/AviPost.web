/* @flow */

// The entrance of the gallery component
import * as ajax from './ajax.js';
import { renderArray } from './template.js';
import { removeNulls } from './helper.js';
import { loadImage } from './async.js';


// cannot declare as UI, because flow requires an interface file to handle
// it, but it restart server every time and is super slow.
var gallery = function(
    root /*: Element */,
    uri /*: string */
) {
    var container = root.querySelector('.page');

    var request = new XMLHttpRequest();
    request.open('GET', uri + '/postcards/');
    request.setRequestHeader("Accept", "application/json");

    var cardElements /* : Promise<[Element]> */ = (
        ajax.promise(request)
        .catch(function(res) {
            console.error(res.statusText);
        })
        .then(function(res) {
            var data = JSON.parse(res.responseText);
            var cards = renderArray(data, container.querySelector('[data-template]'));
            return removeNulls(cards);
        })
    );

    // dom IO
    cardElements.then(function(cards) {
            cards.forEach(function(element) {
                element.classList.add('hide');
                container.appendChild(element);
            });
            return loadImage(container, cards);
        })
        .then(function(cards) {
            // show
            cards.forEach(function(element) {
                element.classList.remove('hide');
            });
        });
};

export { gallery as default };
