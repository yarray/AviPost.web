/* @flow */

// The entrance of the gallery component
var renderArray = require('./template.js').renderArray;
var ajax = require('./ajax.js');
var removeNulls = require('./helper.js').removeNulls;
var loadImage = require('./dom-helper.js').loadImage;


// cannot declare as UI, because flow requires an interface file to handle
// it, but it restart server every time and is super slow.
var gallery = function(
    root /*: Element */,
    uri /*: string */,
    ui /*: Object */
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
                container.appendChild(element);
            });
            cards.forEach(ui.hide);
            return loadImage(container, cards);
        })
        .then(function(cards) {
            // show
            cards.forEach(ui.show);
        });
};

module.exports = gallery;
