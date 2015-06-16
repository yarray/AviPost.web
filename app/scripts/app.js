/* @flow */
// The entrance of the app, mainly do routing & dispatching
require('./polyfill.js')();

var page = require('page');
var createSubpages = require('./subpage.js');

var app = function(config) {
    var subpages = createSubpages([
        {
            key: '/gallery',
            dom: document.querySelector('#gallery'),
            init: function(dom) {
                require('./gallery.js')(dom, config.uri);
            }
        },

        {
            key: '/compose',
            dom: document.querySelector('#compose'),
            init: function(dom) {
                require('./compose.js')(dom, config.uri);
            }
        }
    ]);

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
