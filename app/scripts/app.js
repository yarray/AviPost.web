// The entrance of the app, mainly do routing & dispatching
import flyd from 'flyd';
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
    const routes = router(['#/gallery', '#/compose', '#/'], { shortcut: { '#/': '#/gallery' } });

    // set pages
    const pages = mapObj(
        id => document.getElementById(id)
    )({
        gallery: 'gallery',
        compose: 'compose',
    });

    // routing stream hooked to onhashchange
    const hashchanged$ = flyd.stream(window.location.hash);
    window.onhashchange = () => hashchanged$(window.location.hash);

    const routings$ = flyd.map(routes, hashchanged$);

    // transform and direct stream to gallery
    gallery(
        pages.gallery.firstElementChild,
        resource(config.uri, 'postcards'),
        flyd.map(prop('gallery'), routings$)
    );

    compose(
        pages.compose.firstElementChild,
        resource(config.uri, 'postcards'),
        flyd.map(prop('compose'), routings$)
    );

    common(document.querySelector('nav'), pages, routings$);
}

document.addEventListener('DOMContentLoaded', () => {
    // config is a global variable which will be injected when built
    app(global.config);
});
