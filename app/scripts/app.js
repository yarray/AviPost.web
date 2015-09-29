// The entrance of the app, mainly do routing & dispatching
import most from 'most';
import { forEach } from 'ramda';

import polyfill from './polyfill.js';
import createSubpages from './subpage.js';
import gallery from './gallery.js';
import compose from './compose.js';
import nav from './nav.js';
import resource from './resource.js';
import router from './router.js';

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

    // init router
    const routes = router(
        {
            gallery: '#/gallery',
            compose: '#/compose',
        }
    );
    // set pages
    const pages = {
        gallery: '#gallery',
        compose: '#compose',
    };
    // routing stream hooked to onhashchange
    const routings = most.fromEvent('hashchange', window)
        .tap(console.log(window.location.hash))
        .map(() => routes(window.location.hash));

    // transform and direct stream to gallery
    gallery(
        document.querySelector('#gallery > div'),
        resource(config.uri, 'postcards'),
        routings
    ).drain();

    // hook page show/hide
    routings.observe(states => {
        Object.keys(states).forEach(
            page => {
                document.querySelector(pages[page])
                    .style.display = states[page] ? null : 'none';
            }
        );
    });

    // TODO highlight navElement
    const navElement = document.getElementsByTagName('nav')[0];
    // page('*', (ctx, next) => {
    //     nav(navElement, ctx.pathname);
    //     next();
    // });
    // TODO fallback redirect
}

document.addEventListener('DOMContentLoaded', () => {
    // config is a global variable which will be injected when built
    app(global.config);
});
