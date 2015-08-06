/* @flow */
// The entrance of the app, mainly do routing & dispatching
import page from 'page';

import polyfill from './polyfill.js';
import createSubpages from './subpage.js';
import gallery from './gallery.js';
import compose from './compose.js';
import nav from './nav.js';

polyfill();

function app(config) {
    const subpages = createSubpages([
        {
            key: '/gallery',
            dom: document.querySelector('#gallery'),
            init(dom) {
                gallery(dom, config.uri);
            }
        },

        {
            key: '/compose',
            dom: document.querySelector('#compose'),
            init(dom) {
                compose(dom, config.uri);
            }
        }
    ]);

    page.redirect('/', '/gallery');
    page('*', (ctx, next) => {
        const navElement = document.getElementsByTagName('nav')[0];
        nav(navElement, ctx.pathname);
        next();
    });

    subpages.forEach((handler, path) => {
        page(path, handler);
    });

    page({
        hashbang: true
    });
}

document.addEventListener("DOMContentLoaded", event => {
    // config is a global variable which will be injected when built
    app(global.config);
});
