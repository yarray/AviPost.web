// The entrance of the app, mainly do routing & dispatching
const flyd = require('flyd');
const { prop, mapObj } = require('ramda');

const polyfill = require('./polyfill.js');
const gallery = require('./gallery.js');
const compose = require('./compose.js');
const common = require('./common.js');
const resource = require('./resource.js');
const router = require('./router.js');

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
