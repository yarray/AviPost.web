const L = require('leaflet');

function worldmap(root) {
    const map = L.map(root).setView([51.3, 9.46], 10);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{retina}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        retina: '@2x',
    }).addTo(map);
}

module.exports = worldmap;
