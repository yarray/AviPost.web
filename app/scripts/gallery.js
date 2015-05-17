// The entrance of the gallery component
var imagesLoaded = require('imagesloaded');
var renderArray = require('./template.js').renderArray;


var gallery = function(uri) {
    var container = document.querySelector('#gallery>.page');
    var columnWidth = 300;

    var request = new XMLHttpRequest();
    request.open('GET', uri + '/postcards/');
    request.setRequestHeader("Accept", "application/json");
    request.onload = function(e) {
        if (request.readyState === 4 && request.status === 200) {
            var data = JSON.parse(request.responseText);
            var dom = renderArray(data, container.querySelector('[data-template]'));
            dom.forEach(function(element) {
                // set invisible until all pictures are all loaded
                element.style.visibility = 'hidden';
                container.appendChild(element);
            });
            imagesLoaded(container, function() {
                // show
                dom.forEach(function(element) {
                    element.style.visibility = 'visible';
                });
            }, 1000);

        } else {
            console.error(request.statusText);
        }
    };
    request.send();
};

module.exports = gallery;
