// The entrance of the app, mainly do routing & dispatching
import most from 'most';
import { prop, mapObj } from 'ramda';

import polyfill from './polyfill.js';
import gallery from './gallery.js';
import compose from './compose.js';
import common from './common.js';
import resource from './resource.js';
import router from './router.js';

polyfill();

function app(config) {
    // init router
    const routes = router(['#/gallery', '#/compose']);

    // set pages
    const pages = mapObj(
        id => document.getElementById(id)
    )({
        gallery: 'gallery',
        compose: 'compose',
    });

    // routing stream hooked to onhashchange
    const routings = most.fromEvent('hashchange', window)
        .startWith()
        .map(() => routes.parse(window.location.hash));

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

    common(pages, routings);

    if (!window.location.hash) {
        window.location.hash = '#/gallery';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // config is a global variable which will be injected when built
    app(global.config);
});
