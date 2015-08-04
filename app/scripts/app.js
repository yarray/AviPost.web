/* @flow */
// The entrance of the app, mainly do routing & dispatching
import page from 'page';

import polyfill from './polyfill.js';
import createSubpages from './subpage.js';
import gallery from './gallery.js';
import compose from './compose.js';
import nav from './nav.js';

polyfill();

var app = function(config) {
    var subpages = createSubpages([
        {
            key: '/gallery',
            dom: document.querySelector('#gallery'),
            init: function(dom) {
                gallery(dom, config.uri);
            }
        },

        {
            key: '/compose',
            dom: document.querySelector('#compose'),
            init: function(dom) {
                compose(dom, config.uri);
            }
        }
    ]);

    page.redirect('/', '/gallery');
    page('*', function(ctx, next) {
        var navElement = document.getElementsByTagName('nav')[0];
        nav(navElement, ctx.pathname);
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
