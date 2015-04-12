// The entrance of the gallery component
var Masonry = require('masonry-layout');
var imagesLoaded = require('imagesloaded');
var gallery = function(uri) {
    var container = document.querySelector('#gallery>.page');
    imagesLoaded(container, function() {
        new Masonry(container, {
            itemSelector: 'li',
            gutter: 0
        });
    });
};

module.exports = gallery;
