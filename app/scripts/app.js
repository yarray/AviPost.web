// The entrance of the app, mainly do routing & dispatching
import most from 'most';
import snabbdom from 'snabbdom';
import { prop, mapObj } from 'ramda';

import polyfill from './polyfill.js';
import nav from './nav.js';
import gallery from './gallery.js';
import compose from './compose.js';
import resource from './resource.js';
import router from './router.js';

polyfill();

function app(config) {
    // init router
    const routes = router(
        {
            gallery: '#/gallery',
            compose: '#/compose',
        }
    );
    // set pages
    const pages = mapObj(
        selector => document.querySelector(selector)
    )({
        gallery: '#gallery',
        compose: '#compose',
    });

    // routing stream hooked to onhashchange
    const routings = most.fromEvent('hashchange', window)
        .startWith()
        .map(() => routes(window.location.hash));

    // transform and direct stream to gallery
    gallery(
        pages.gallery.firstElementChild,
        resource(config.uri, 'postcards'),
        routings.map(prop('gallery'))
    );

    compose(
        pages.compose,
        resource(config.uri, 'postcards'),
        routings.map(prop('compose'))
    );

    const navElement = document.getElementsByTagName('nav')[0];
    // hook page show/hide
    routings.observe(states => {
        Object.keys(states).forEach(
            page => {
                pages[page].style.display = states[page] ? null : 'none';
            }
        );
    });

    const patch = snabbdom.init([
        require('snabbdom/modules/props'),
        require('snabbdom/modules/class'),
    ]);

    routings.map(nav).reduce(patch, navElement);

    if (!window.location.hash) {
        window.location.hash = '#/gallery';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // config is a global variable which will be injected when built
    app(global.config);
});
