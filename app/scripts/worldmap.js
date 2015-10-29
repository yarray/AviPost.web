const L = require('leaflet');
const { map } = require('ramda');

function worldmap(root, postcards) {
    L.Icon.Default.imagePath = 'images/leaflet/';

    const worldMap = L.map(root).setView([51.3, 9.46], 10);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{retina}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        retina: '@2x',
    }).addTo(worldMap);

    postcards.get().then(
        map(({ latitude, longitude }) => {
            L.marker([ latitude, longitude ]).addTo(worldMap);
        })
    );
}

module.exports = worldmap;
