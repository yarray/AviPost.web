// The entrance of the app, mainly do routing & dispatching
import page from 'page';

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
            init(dom) {
                // TODO workaround
                gallery(dom.children[0], resource(config.uri, 'postcards'));
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

    subpages.forEach((handler, path) => {
        page(path, handler);
    });

    page({
        hashbang: true,
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // config is a global variable which will be injected when built
    app(global.config);
});
