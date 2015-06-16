/* @flow */
// The entrance of the app, mainly do routing & dispatching
require('./polyfill.js')();

var page = require('page');
var ui = require('./ui.js')();
var createSubpages = require('./subpage.js');

var app = function(config) {
    var galleryRoot = document.querySelector('#gallery');
    var composeRoot = document.querySelector('#compose');

    var subpages = createSubpages([
        {
            key: '/gallery',
            dom: galleryRoot,
            init: function() {
                require('./gallery.js')(galleryRoot, config.uri, ui);
            }
        },

        {
            key: '/compose',
            dom: composeRoot,
            init: function() {
                require('./compose.js')(composeRoot, config.uri, ui);
            }
        }
    ], ui);

    page.redirect('/', '/gallery');
    page('*', function(ctx, next) {
        var nav = document.getElementsByTagName('nav')[0];
        require('./nav.js')(nav, ctx.pathname);
        next();
    });

    subpages.forEach(function(handler, path) {
        page(path, handler);
    });

    page({
        hashbang: true
    });
};

document.addEventListener("DOMContentLoaded", function(event) {
    // config is a global variable which will be injected when built
    app(global.config);
});
