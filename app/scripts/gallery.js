// The entrance of the gallery component
var Masonry = require('masonry-layout');
var imagesLoaded = require('imagesloaded');
var renderArray = require('./template.js').renderArray;


var gallery = function(uri) {
    var container = document.querySelector('#gallery>.page');
    var masonry = new Masonry(container, {
        itemSelector: 'li',
        columnWidth: 200, // has to declare 2 times in css and here
        gutter: 0,
        hiddenStyle: {
            opacity: 0,
            transform: 'translateY(150%)'
                // 'transform-origin': '50% 0 0'
        },
        transitionDuration: '1s'
    });

    var request = new XMLHttpRequest();
    request.open('GET', uri + '/postcards');
    request.onload = function(e) {
        if (request.readyState === 4 && request.status === 200) {
            console.log(request.responseText);
            var data = JSON.parse(request.responseText);
            var dom = renderArray(data, container.querySelector('[data-template]'));
            dom.forEach(function(element) {
                // set invisible until all pictures are loaded
                element.style.visibility = 'hidden';
                container.appendChild(element);
            });
            imagesLoaded(container, function() {
                // show
                dom.forEach(function(element) {
                    element.style.visibility = 'visible';
                });
                // layout
                masonry.appended(dom);
            });

        } else {
            console.error(request.statusText);
        }
    };
    request.send();
};

module.exports = gallery;
