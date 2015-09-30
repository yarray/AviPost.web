// The entrance of the app, mainly do routing & dispatching
import most from 'most';
import { prop, mapObj } from 'ramda';

import polyfill from './polyfill.js';
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
    ).drain();

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
                const nav = navElement.querySelector(`[data-page="${page}"]`);
                if (states[page]) {
                    nav.classList.remove('inactive');
                } else {
                    nav.classList.add('inactive');
                }
            }
        );
    });

    // TODO first time not work
    // TODO fallback redirect
}

document.addEventListener('DOMContentLoaded', () => {
    // config is a global variable which will be injected when built
    app(global.config);
});
