// The entrance of the app, mainly do routing & dispatching
import page from 'page';
import most from 'most';

import polyfill from './polyfill.js';
import createSubpages from './subpage.js';
import gallery from './gallery.js';
import compose from './compose.js';
import nav from './nav.js';
import resource from './resource.js';

polyfill();

function app(config) {
    const subpages = createSubpages([
        {
            key: '/gallery',
            dom: document.querySelector('#gallery'),
            init() {
            },
        },

        {
            key: '/compose',
            dom: document.querySelector('#compose'),
            init(dom) {
                compose(dom, resource(config.uri, 'postcards'));
            },
        },
    ]);

    page.redirect('/', '/gallery');
    page('*', (ctx, next) => {
        const navElement = document.getElementsByTagName('nav')[0];
        nav(navElement, ctx.pathname);
        next();
    });

    const galleryOn = most.create(add => {
        page('/gallery', ctx => {
            subpages.get('/gallery')();
            add(ctx);
        });
    }).constant(true);

    const galleryOff = most.create(add => {
        page('/compose', ctx => {
            subpages.get('/compose')();
            add(ctx);
        });
    }).constant(false);

    gallery(document.querySelector('#gallery > div'), resource(config.uri, 'postcards'),
            galleryOn, galleryOff).drain();

    page({
        hashbang: true,
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // config is a global variable which will be injected when built
    app(global.config);
});
